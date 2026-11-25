import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it, vi } from 'vitest';
import { findCountryById } from './country-repository';
import { findGenreById } from './genre-repository';
import { findMovieById } from './movies-repository';
import { initializeSchema } from './schema';
import { updateMoviesDatabase } from './update-service';

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
}

function response(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 503,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe('update movie database service', () => {
  it('updates movies, genres, countries, and their relationships from TMDB', async () => {
    const database = createDatabase();
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ genres: [{ id: 18, name: 'Drama' }] }))
      .mockResolvedValueOnce(
        response([{ iso_3166_1: 'FR', english_name: 'France' }]),
      )
      .mockResolvedValueOnce(
        response({
          page: 1,
          results: [{ id: 10 }],
          total_pages: 1,
          total_results: 1,
        }),
      )
      .mockResolvedValueOnce(
        response({
          id: 10,
          title: 'The Film',
          original_title: 'The Film',
          original_language: 'fr',
          overview: 'Overview',
          release_date: '2020-01-02',
          popularity: 10,
          vote_average: 8,
          vote_count: 20,
          poster_path: null,
          backdrop_path: null,
          genres: [{ id: 18, name: 'Drama' }],
          production_countries: [{ iso_3166_1: 'FR', name: 'France' }],
          runtime: 100,
          budget: 1000,
          revenue: 2000,
        }),
      );

    try {
      await expect(
        updateMoviesDatabase(database, {
          year: 2020,
          accessToken: 'test-token',
          fetchImpl,
        }),
      ).resolves.toBe(1);

      expect(findMovieById(database, 10)?.title).toBe('The Film');
      expect(findGenreById(database, 18)).toEqual({ id: 18, name: 'Drama' });
      expect(findCountryById(database, 'FR')).toEqual({
        code: 'FR',
        name: 'France',
      });
      expect(database.prepare('SELECT * FROM movie_genres').all()).toEqual([
        { movie_id: 10, genre_id: 18 },
      ]);
      expect(
        database.prepare('SELECT * FROM production_countries').all(),
      ).toEqual([{ movie_id: 10, country_code: 'FR' }]);
    } finally {
      database.close();
    }
  });

  it('does not open a transaction when a TMDB request fails', async () => {
    const database = createDatabase();
    const fetchImpl = vi.fn().mockResolvedValue(response({}, false));

    try {
      await expect(
        updateMoviesDatabase(database, {
          year: 2020,
          accessToken: 'test-token',
          fetchImpl,
        }),
      ).rejects.toThrow('status 503');
      expect(
        database.prepare('SELECT COUNT(*) AS count FROM movies').get(),
      ).toEqual({ count: 0 });
    } finally {
      database.close();
    }
  });

  it('rejects an empty access token before making a request', async () => {
    const database = createDatabase();
    const fetchImpl = vi.fn();

    try {
      await expect(
        updateMoviesDatabase(database, {
          year: 2020,
          accessToken: '',
          fetchImpl,
        }),
      ).rejects.toThrow('TMDB access token is required');
      expect(fetchImpl).not.toHaveBeenCalled();
    } finally {
      database.close();
    }
  });

  it('rolls back all changes when a movie relation cannot be persisted', async () => {
    const database = createDatabase();
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ genres: [] }))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(
        response({
          page: 1,
          results: [{ id: 10 }],
          total_pages: 1,
          total_results: 1,
        }),
      )
      .mockResolvedValueOnce(
        response({
          id: 10,
          title: 'The Film',
          original_title: 'The Film',
          original_language: 'fr',
          overview: 'Overview',
          release_date: '2020-01-02',
          popularity: 10,
          vote_average: 8,
          vote_count: 20,
          poster_path: null,
          backdrop_path: null,
          genres: [{ id: 18, name: 'Drama' }],
          runtime: 100,
          budget: 1000,
          revenue: 2000,
        }),
      );

    try {
      await expect(
        updateMoviesDatabase(database, {
          year: 2020,
          accessToken: 'test-token',
          fetchImpl,
        }),
      ).rejects.toThrow('FOREIGN KEY constraint failed');
      expect(database.prepare('SELECT * FROM movies').all()).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('uses default options and normalizes missing or zero TMDB values', async () => {
    const database = createDatabase();
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ genres: [] }))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(
        response({
          page: 1,
          results: [{ id: 11 }],
          total_pages: 1,
          total_results: 1,
        }),
      )
      .mockResolvedValueOnce(
        response({
          id: 11,
          title: 'Minimal Film',
          original_title: 'Minimal Film',
          original_language: 'en',
          overview: '',
          release_date: '2020-01-02',
          popularity: 0,
          vote_average: 0,
          vote_count: 0,
          poster_path: '/poster',
          backdrop_path: '/backdrop',
          genres: [],
          runtime: null,
          budget: 0,
          revenue: 0,
        }),
      );

    vi.stubGlobal('fetch', fetchImpl);
    try {
      await expect(
        updateMoviesDatabase(database, { year: 2020 }),
      ).resolves.toBe(1);
      expect(findMovieById(database, 11)).toMatchObject({
        runtime: 1,
        budget: 1,
        revenue: 1,
        poster_path: '/poster',
        backdrop_path: '/backdrop',
      });
    } finally {
      vi.unstubAllGlobals();
      database.close();
    }
  });
});
