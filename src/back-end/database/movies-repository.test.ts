import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import {
  findMovieById,
  listMovies,
  upsertMovies,
  type Movie,
} from './movies-repository';
import { initializeSchema } from './schema';

const firstMovie: Movie = {
  id: 2,
  title: 'The Film',
  original_title: 'The Original Film',
  original_language: 'en',
  overview: 'A film overview.',
  release_date: new Date('2020-05-01T00:00:00.000Z'),
  popularity: 12.5,
  vote_average: 7.4,
  vote_count: 100,
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  runtime: 120,
  budget: 1000,
  revenue: 2000,
};

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
}

describe('movies repository', () => {
  it('inserts movies, finds them by id, and lists them by id', () => {
    const database = createDatabase();
    try {
      upsertMovies(database, [
        firstMovie,
        { ...firstMovie, id: 1, title: 'Earlier Film' },
      ]);

      expect(findMovieById(database, firstMovie.id)).toEqual(firstMovie);
      expect(listMovies(database).map((movie) => movie.id)).toEqual([1, 2]);
      expect(findMovieById(database, 999)).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('updates all persisted movie information when the id already exists', () => {
    const database = createDatabase();
    try {
      upsertMovies(database, [firstMovie]);
      const updatedMovie = {
        ...firstMovie,
        title: 'Updated Film',
        overview: 'Updated overview.',
        runtime: 135,
        revenue: 3000,
      };

      upsertMovies(database, [updatedMovie]);

      expect(findMovieById(database, firstMovie.id)).toEqual(updatedMovie);
      expect(listMovies(database)).toHaveLength(1);
    } finally {
      database.close();
    }
  });

  it('accepts any iterable and keeps the last value for repeated ids', () => {
    const database = createDatabase();
    try {
      function* movies(): Iterable<Movie> {
        yield firstMovie;
        yield { ...firstMovie, title: 'Last Title' };
      }

      upsertMovies(database, movies());

      expect(findMovieById(database, firstMovie.id)?.title).toBe('Last Title');
      expect(listMovies(database)).toHaveLength(1);
    } finally {
      database.close();
    }
  });

  it('does not modify data when given an empty iterable', () => {
    const database = createDatabase();
    try {
      upsertMovies(database, []);

      expect(listMovies(database)).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('persists and restores release dates as Date values', () => {
    const database = createDatabase();
    try {
      const movie: Movie = {
        ...firstMovie,
        id: 3,
        release_date: new Date('2021-06-02T12:00:00.000Z'),
      };

      upsertMovies(database, [movie]);

      expect(findMovieById(database, movie.id)).toEqual({
        ...movie,
        release_date: new Date('2021-06-02T00:00:00.000Z'),
      });
    } finally {
      database.close();
    }
  });
});
