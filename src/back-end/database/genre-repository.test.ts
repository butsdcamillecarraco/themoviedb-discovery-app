import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import {
  findGenreById,
  listGenres,
  type Genre,
  upsertGenres,
} from './genre-repository';
import { initializeGenresSchema } from './schema';

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  database.exec('CREATE TABLE movies (id INTEGER PRIMARY KEY);');
  initializeGenresSchema(database);
  return database;
}

describe('genre repository', () => {
  it('finds an existing genre and returns undefined for an unknown identifier', () => {
    const database = createDatabase();
    try {
      database
        .prepare('INSERT INTO genres (id, name) VALUES (?, ?)')
        .run(18, 'Drama');

      expect(findGenreById(database, 18)).toEqual({ id: 18, name: 'Drama' });
      expect(findGenreById(database, 99)).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('lists genres in ascending identifier order', () => {
    const database = createDatabase();
    try {
      upsertGenres(database, [
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
      ]);

      expect(listGenres(database)).toEqual([
        { id: 18, name: 'Drama' },
        { id: 35, name: 'Comedy' },
      ]);
    } finally {
      database.close();
    }
  });

  it('inserts and updates genres without creating duplicates', () => {
    const database = createDatabase();
    try {
      upsertGenres(database, [
        { id: 18, name: 'Drama' },
        { id: 18, name: 'Dramatic' },
      ]);

      expect(listGenres(database)).toEqual([{ id: 18, name: 'Dramatic' }]);
    } finally {
      database.close();
    }
  });

  it('accepts arrays and other iterables, and leaves data unchanged for an empty iterable', () => {
    const database = createDatabase();
    try {
      const genres: Genre[] = [{ id: 18, name: 'Drama' }];
      upsertGenres(database, genres);
      upsertGenres(database, new Set([{ id: 35, name: 'Comedy' }]));
      upsertGenres(database, []);

      expect(listGenres(database)).toEqual([
        { id: 18, name: 'Drama' },
        { id: 35, name: 'Comedy' },
      ]);
    } finally {
      database.close();
    }
  });

  it('enforces the required genre name', () => {
    const database = createDatabase();
    try {
      expect(() =>
        upsertGenres(database, [{ id: 18, name: null as never }]),
      ).toThrow(/NOT NULL constraint failed/);
    } finally {
      database.close();
    }
  });
});
