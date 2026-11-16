import type { Express, Request, RequestHandler, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE,
  DEFAULT_REGION,
} from '../utils/constants';
import { tmdbAccessToken } from '../utils/config';
import type { TmdbMoviesRawResponse } from '../types/MoviesTypes';
import { registerDiscoverApi } from './discover-api';

const { toSupportedMovieMock } = vi.hoisted(() => ({
  toSupportedMovieMock: vi.fn(),
}));

vi.mock('../utils/converter', () => ({
  toSupportedMovie: toSupportedMovieMock,
}));

vi.mock('../utils/config', () => ({
  tmdbAccessToken: 'test-access-token',
}));

type RouteHandler = (
  req: Request,
  res: Response,
  next: (error?: unknown) => void,
) => void | Promise<void>;

const handlers = new Map<string, RequestHandler>();
const app = {
  get: (path: string, handler: RequestHandler) => handlers.set(path, handler),
} as unknown as Express;

function getHandler(): RouteHandler {
  const handler = handlers.get('/api/discover/movies');
  if (!handler) throw new Error('Discover route is not registered');
  return handler as RouteHandler;
}

function createResponse() {
  const response = { json: vi.fn(), status: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response & {
    json: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };
}

function tmdbResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe('discover API', () => {
  beforeEach(() => {
    handlers.clear();
    registerDiscoverApi(app);
    toSupportedMovieMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('registers the discover route and uses default options', async () => {
    const rawMovie = { id: 1 };
    const rawData = {
      page: 1,
      results: [rawMovie],
      total_pages: 2,
      total_results: 1,
    } as unknown as TmdbMoviesRawResponse;
    const supportedMovie = { id: 1, title: 'Movie' };
    const fetchMock = vi.fn().mockResolvedValue(tmdbResponse(rawData));
    vi.stubGlobal('fetch', fetchMock);
    toSupportedMovieMock.mockReturnValue(supportedMovie);
    const response = createResponse();

    await getHandler()(
      { query: { year: '2020' } } as unknown as Request,
      response,
      vi.fn(),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/discover/movie?primary_release_year=2020&language=${DEFAULT_LANGUAGE}&page=${DEFAULT_PAGE}&region=${DEFAULT_REGION}`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${tmdbAccessToken}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      }),
    );
    expect(toSupportedMovieMock.mock.calls[0]?.[0]).toEqual(rawMovie);
    expect(response.json).toHaveBeenCalledWith({
      page: 1,
      results: [supportedMovie],
      total_pages: 2,
      total_results: 1,
    });
  });

  it('passes custom options and preserves an empty TMDB result page', async () => {
    const rawData = {
      page: 2,
      results: [],
      total_pages: 2,
      total_results: 0,
    } as unknown as TmdbMoviesRawResponse;
    const fetchMock = vi.fn().mockResolvedValue(tmdbResponse(rawData));
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await getHandler()(
      {
        query: {
          year: '2020',
          language: 'en-US',
          page: '2',
          region: 'US',
        },
      } as unknown as Request,
      response,
      vi.fn(),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/discover/movie?primary_release_year=2020&language=en-US&page=2&region=US',
      expect.anything(),
    );
    expect(response.json).toHaveBeenCalledWith(rawData);
  });

  it.each([
    {},
    { year: '' },
    { year: '999' },
    { year: '10000' },
    { year: '20a0' },
    { year: ['2020', '2021'] },
    { year: { value: '2020' } },
  ])('rejects invalid year query %# without calling TMDB', async (query) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await getHandler()({ query } as unknown as Request, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Invalid year: expected a four-digit year between 1000 and 9999',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { message: 'HTTP error', response: tmdbResponse({}, false, 503) },
    { message: 'network error', response: new Error('Network error') },
    {
      message: 'JSON error',
      response: {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      },
    },
  ])(
    'returns and logs a 500 for a TMDB $message',
    async ({ response: tmdbResult }) => {
      const fetchMock = vi.fn().mockResolvedValue(tmdbResult);
      if (tmdbResult instanceof Error) fetchMock.mockRejectedValue(tmdbResult);
      vi.stubGlobal('fetch', fetchMock);
      const result = createResponse();

      await getHandler()(
        { query: { year: '2020' } } as unknown as Request,
        result,
        vi.fn(),
      );

      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        error: 'Failed to discover movies',
      });
      expect(console.error).toHaveBeenCalled();
    },
  );
});
