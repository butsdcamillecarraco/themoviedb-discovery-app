import type { DatabaseSync } from 'node:sqlite';
import { tmdbAccessToken } from '../utils/config';
import type {
  TmdbMovieDetails,
  TmdbMoviesRawResponse,
} from '../types/MoviesTypes';
import { upsertCountries, type Country } from './country-repository';
import { upsertGenres, type Genre } from './genre-repository';
import {
  replaceMovieRelations,
  upsertMovies,
  type Movie,
} from './movies-repository';

type TmdbGenreResponse = { genres: Genre[] };
type TmdbCountryResponse = Array<{ iso_3166_1: string; english_name: string }>;

export type UpdateMoviesOptions = {
  year: number;
  language?: string;
  region?: string;
  page?: number;
  fetchImpl?: typeof fetch;
  accessToken?: string;
};

function requestHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json;charset=utf-8',
  };
}

async function fetchJson<T>(
  url: string,
  fetchImpl: typeof fetch,
  accessToken: string,
): Promise<T> {
  const response = await fetchImpl(url, {
    headers: requestHeaders(accessToken),
  });
  if (!response.ok) {
    throw new Error(`TMDB API request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

function toMovie(details: TmdbMovieDetails): Movie {
  return {
    id: details.id,
    title: details.title,
    original_title: details.original_title,
    original_language: details.original_language,
    overview: details.overview,
    release_date: new Date(`${details.release_date}T00:00:00.000Z`),
    popularity: details.popularity,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    poster_path: details.poster_path ?? '',
    backdrop_path: details.backdrop_path ?? '',
    runtime: details.runtime ?? 1,
    budget: details.budget || 1,
    revenue: details.revenue || 1,
  };
}

/**
 * Synchronizes one discover page and its movie details with the local database.
 */
export async function updateMoviesDatabase(
  database: DatabaseSync,
  options: UpdateMoviesOptions,
): Promise<number> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const accessToken = options.accessToken ?? tmdbAccessToken;
  if (!accessToken) {
    throw new Error('TMDB access token is required to update the database');
  }
  const language = options.language ?? 'fr-FR';
  const page = options.page ?? 1;
  const region = options.region ?? 'FR';
  const query = new URLSearchParams({
    primary_release_year: String(options.year),
    language,
    region,
    page: String(page),
  });
  const baseUrl = 'https://api.themoviedb.org/3';

  const [genreResponse, countryResponse, movieResponse] = await Promise.all([
    fetchJson<TmdbGenreResponse>(
      `${baseUrl}/genre/movie/list?language=${encodeURIComponent(language)}`,
      fetchImpl,
      accessToken,
    ),
    fetchJson<TmdbCountryResponse>(
      `${baseUrl}/configuration/countries?language=${encodeURIComponent(language)}`,
      fetchImpl,
      accessToken,
    ),
    fetchJson<TmdbMoviesRawResponse>(
      `${baseUrl}/discover/movie?${query.toString()}`,
      fetchImpl,
      accessToken,
    ),
  ]);

  const details = await Promise.all(
    movieResponse.results.map((movie) =>
      fetchJson<TmdbMovieDetails>(
        `${baseUrl}/movie/${movie.id}?language=${encodeURIComponent(language)}`,
        fetchImpl,
        accessToken,
      ),
    ),
  );
  const movies = details.map(toMovie);
  const countries: Country[] = countryResponse.map((country) => ({
    code: country.iso_3166_1,
    name: country.english_name,
  }));
  const movieCountries = new Set(
    details.flatMap((movie) =>
      (movie.production_countries ?? []).map((country) => country.iso_3166_1),
    ),
  );
  const usedGenres = genreResponse.genres.filter((genre) =>
    details.some((movie) => movie.genres.some(({ id }) => id === genre.id)),
  );
  const usedCountries = countries.filter((country) =>
    movieCountries.has(country.code),
  );

  database.exec('BEGIN TRANSACTION');
  try {
    upsertGenres(database, usedGenres);
    upsertCountries(database, usedCountries);
    upsertMovies(database, movies);
    details.forEach((detail) =>
      replaceMovieRelations(
        database,
        detail.id,
        detail.genres.map(({ id }) => id),
        (detail.production_countries ?? []).map(({ iso_3166_1 }) => iso_3166_1),
      ),
    );
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }

  return movies.length;
}
