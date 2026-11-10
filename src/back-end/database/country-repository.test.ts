import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import {
  findCountryById,
  listCountries,
  type Country,
  upsertCountries,
} from './country-repository';
import { initializeCountriesSchema } from './schema';

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  database.exec('CREATE TABLE movies (code STRING PRIMARY KEY);');
  initializeCountriesSchema(database);
  return database;
}

describe('country repository', () => {
  it('finds an existing country and returns undefined for an unknown identifier', () => {
    const database = createDatabase();
    try {
      database
        .prepare('INSERT INTO countries (code, name) VALUES (?, ?)')
        .run('FR', 'FRANCE');

      expect(findCountryById(database, 'FR')).toEqual({
        code: 'FR',
        name: 'FRANCE',
      });
      expect(findCountryById(database, 'CA')).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('lists countries in ascending identifier order', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [
        { code: 'FR', name: 'FRANCE' },
        { code: 'GB', name: 'UNITED KINGDOM' },
      ]);

      expect(listCountries(database)).toEqual([
        { code: 'GB', name: 'UNITED KINGDOM' },
        { code: 'FR', name: 'FRANCE' },
      ]);
    } finally {
      database.close();
    }
  });

  it('inserts and updates countries without creating duplicates', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [
        { code: 'GB', name: 'UNITED KINGDOM' },
        { code: 'GB', name: 'UNITED KINGDOM' },
      ]);

      expect(listCountries(database)).toEqual([
        { code: 'GB', name: 'UNITED KINGDOM' },
      ]);
    } finally {
      database.close();
    }
  });

  it('accepts arrays and other iterables, and leaves data unchanged for an empty iterable', () => {
    const database = createDatabase();
    try {
      const Countrys: Country[] = [{ code: 'GB', name: 'UNITED KINGDOM' }];
      upsertCountries(database, Countrys);
      upsertCountries(database, new Set([{ code: 'FR', name: 'FRANCE' }]));
      upsertCountries(database, []);

      expect(listCountries(database)).toEqual([
        { code: 'GB', name: 'UNITED KINGDOM' },
        { code: 'FR', name: 'FRANCE' },
      ]);
    } finally {
      database.close();
    }
  });

  it('enforces the required country name', () => {
    const database = createDatabase();
    try {
      expect(() =>
        upsertCountries(database, [{ code: 'GB', name: null as never }]),
      ).toThrow(/NOT NULL constraint failed/);
    } finally {
      database.close();
    }
  });
});
