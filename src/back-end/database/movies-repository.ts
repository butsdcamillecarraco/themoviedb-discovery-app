import type { DatabaseSync } from 'node:sqlite';

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  release_date: Date;
  popularity: number;
  vote_average: number;
  vote_count: number;
  poster_path: string;
  backdrop_path: string;
  runtime: number;
  budget: number;
  revenue: number;
  //   genres : Array<number>;
  //   production_countries : Array<string>;
};

const movieColumns = `
  id,
  title,
  original_title,
  original_language,
  overview,
  release_date,
  popularity,
  vote_average,
  vote_count,
  poster_path,
  backdrop_path,
  runtime_minutes AS runtime,
  budget,
  revenue
`;

function toMovie(row: Record<string, unknown>): Movie {
  return {
    ...row,
    release_date: new Date(row.release_date as string),
  } as Movie;
}

/**
 * Finds a movie by its identifier.
 */
export function findMovieById(
  database: DatabaseSync,
  id: number,
): Movie | undefined {
  const movie = database
    .prepare(`SELECT ${movieColumns} FROM movies WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;
  return movie ? toMovie(movie) : undefined;
}

/**
 * Lists all movies ordered by their identifier.
 */
export function listMovies(database: DatabaseSync): Movie[] {
  return database
    .prepare(`SELECT ${movieColumns} FROM movies ORDER BY id ASC`)
    .all()
    .map((movie) => toMovie(movie as Record<string, unknown>));
}

/**
 * Inserts or updates movies.
 */
export function upsertMovies(
  database: DatabaseSync,
  movies: Iterable<Movie>,
): void {
  const statement = database.prepare(`
    INSERT INTO movies (
      id,
      title,
      original_title,
      original_language,
      overview,
      release_date,
      popularity,
      vote_average,
      vote_count,
      poster_path,
      backdrop_path,
      runtime_minutes,
      budget,
      revenue,
      collected_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      original_title = excluded.original_title,
      original_language = excluded.original_language,
      overview = excluded.overview,
      release_date = excluded.release_date,
      popularity = excluded.popularity,
      vote_average = excluded.vote_average,
      vote_count = excluded.vote_count,
      poster_path = excluded.poster_path,
      backdrop_path = excluded.backdrop_path,
      runtime_minutes = excluded.runtime_minutes,
      budget = excluded.budget,
      revenue = excluded.revenue,
      collected_at = excluded.collected_at
  `);

  for (const movie of movies) {
    statement.run(
      movie.id,
      movie.title,
      movie.original_title,
      movie.original_language,
      movie.overview,
      movie.release_date.toISOString().slice(0, 10),
      movie.popularity,
      movie.vote_average,
      movie.vote_count,
      movie.poster_path,
      movie.backdrop_path,
      movie.runtime,
      movie.budget,
      movie.revenue,
      null,
    );
  }
}
