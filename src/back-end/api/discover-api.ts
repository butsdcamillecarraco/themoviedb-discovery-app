import type { Express, Request, Response } from 'express';
import { tmdbAccessToken } from '../utils/config';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE,
  DEFAULT_REGION,
} from '../utils/constants';
import { toSupportedMovie } from '../utils/converter';
import type {
  MoviesApiResponse,
  TmdbMoviesRawResponse,
} from '../types/MoviesTypes';

const invalidYearMessage =
  'Invalid year: expected a four-digit year between 1000 and 9999';

function getNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function createDiscoverQueryParams(
  query: Request['query'],
): URLSearchParams {
  const year = query.year;
  if (
    typeof year !== 'string' ||
    !/^\d{4}$/.test(year) ||
    Number(year) < 1000 ||
    Number(year) > 9999
  ) {
    throw new Error(invalidYearMessage);
  }

  const queryParams = new URLSearchParams({
    primary_release_year: year,
    language: getNonEmptyString(query.language) ?? DEFAULT_LANGUAGE,
    page: getNonEmptyString(query.page) ?? String(DEFAULT_PAGE),
    region: getNonEmptyString(query.region) ?? DEFAULT_REGION,
  });

  return queryParams;
}

export function registerDiscoverApi(app: Express): void {
  app.get(
    '/api/discover/movies',
    async (req: Request, res: Response): Promise<void> => {
      let queryParams: URLSearchParams;
      try {
        queryParams = createDiscoverQueryParams(req.query);
      } catch {
        res.status(400).json({ error: invalidYearMessage });
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${tmdbAccessToken}`,
              'Content-Type': 'application/json;charset=utf-8',
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `TMDB API request failed with status ${response.status}`,
          );
        }

        const rawData = (await response.json()) as TmdbMoviesRawResponse;
        const data: MoviesApiResponse = {
          page: rawData.page,
          results: rawData.results.map(toSupportedMovie),
          total_pages: rawData.total_pages,
          total_results: rawData.total_results,
        };

        res.json(data);
      } catch (error) {
        console.error('Error discovering movies:', error);
        res.status(500).json({ error: 'Failed to discover movies' });
      }
    },
  );
}
