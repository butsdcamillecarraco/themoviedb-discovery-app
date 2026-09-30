import { tmdbAccessToken } from './config';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE, DEFAULT_REGION } from './constants';
import {
  MoviesApiResponse,
  TmdbMoviesRawResponse,
} from './schemas/MoviesTypes';
import { toSupportedMovie } from './utils';
import type { Express } from 'express';
import express from 'express';

export function registerMoviesApi(app: Express): void {
  app.get(
    '/api/movies/popular',
    async (_req: express.Request, res: express.Response) => {
      // Create a URLSearchParams object to build the query string for the TMDB API request
      const queryParams = new URLSearchParams();
      // Extract query parameters from the request and append them to the query string
      const { language, page, region } = _req.query;
      queryParams.append('language', (language as string) || DEFAULT_LANGUAGE);
      queryParams.append('page', (page as string) || DEFAULT_PAGE);
      queryParams.append('region', (region as string) || DEFAULT_REGION);
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular',
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
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
      }
    },
  );
  app.get(
    '/api/movies/:id',
    async (req: express.Request, res: express.Response) => {
      const { id } = req.params;
      const { language } = req.query;

      // Create a URLSearchParams object to build the query string for the TMDB API request
      const queryParams = new URLSearchParams();
      queryParams.append('language', (language as string) || DEFAULT_LANGUAGE);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?${queryParams.toString()}`,
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

        const rawData = await response.json();
        res.json(rawData);
      } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
      }
    },
  );
}
