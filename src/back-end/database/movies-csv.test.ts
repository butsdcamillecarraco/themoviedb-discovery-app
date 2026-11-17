import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { importMoviesCsv, parseMoviesCsv } from './movies-csv';
import { findMovieById } from './movies-repository';
import { initializeSchema } from './schema';

const header =
  'id,title,original_title,original_language,overview,release_date,popularity,vote_average,vote_count,poster_path,backdrop_path,runtime,budget,revenue';
const row =
  '1,Movie,Original,en,Overview,2020-01-02,10.5,7.5,100,/poster,/backdrop,120,1000,2000';

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
}

describe('movies CSV', () => {
  it('parses movie values and accepts optional relation columns', () => {
    const csv = `\uFEFF${header},genres,production_countries\n${row},"[1,2]","[{""iso_3166_1"":""FR""}]"`;
    expect(parseMoviesCsv(csv)).toEqual([
      {
        id: 1,
        title: 'Movie',
        original_title: 'Original',
        original_language: 'en',
        overview: 'Overview',
        release_date: new Date('2020-01-02T00:00:00.000Z'),
        popularity: 10.5,
        vote_average: 7.5,
        vote_count: 100,
        poster_path: '/poster',
        backdrop_path: '/backdrop',
        runtime: 120,
        budget: 1000,
        revenue: 2000,
      },
    ]);
  });

  it('imports movies and updates an existing movie', () => {
    const database = createDatabase();
    try {
      importMoviesCsv(database, `${header}\n${row}`);
      importMoviesCsv(
        database,
        `${header}\n${row.replace('Movie', 'Updated Movie')}`,
      );
      expect(findMovieById(database, 1)?.title).toBe('Updated Movie');
    } finally {
      database.close();
    }
  });

  it.each([
    ['', 'the movie headers are required'],
    ['id,title', 'headers must contain the movie fields'],
    [`${header},genres`, 'headers must contain the movie fields'],
    [`${header},id`, 'headers must contain the movie fields'],
  ])('rejects invalid headers', (invalidHeader, message) => {
    expect(() => parseMoviesCsv(invalidHeader)).toThrow(message);
  });

  it('rejects malformed CSV rows', () => {
    expect(() => parseMoviesCsv(`${header}\n${row},extra`)).toThrow(
      'Invalid movies CSV:',
    );
    expect(() => parseMoviesCsv('"unterminated')).toThrow(
      'Invalid movies CSV:',
    );
  });

  it.each([
    ['id', 'x'],
    ['popularity', 'x'],
    ['vote_average', 'x'],
    ['vote_count', '1.5'],
    ['runtime', 'x'],
    ['budget', 'x'],
    ['revenue', 'x'],
  ])('rejects an invalid %s value', (field, value) => {
    const values = row.split(',');
    values[header.split(',').indexOf(field)] = value;
    expect(() => parseMoviesCsv(`${header}\n${values.join(',')}`)).toThrow(
      `${field} must be a valid number`,
    );
  });

  it('rejects invalid dates and required text fields', () => {
    expect(() =>
      parseMoviesCsv(`${header}\n${row.replace('2020-01-02', '02-01-2020')}`),
    ).toThrow('release_date must be YYYY-MM-DD');
    expect(() =>
      parseMoviesCsv(`${header}\n${row.replace('2020-01-02', '2020-13-01')}`),
    ).toThrow('release_date must be a valid date');
    expect(() =>
      parseMoviesCsv(`${header}\n${row.replace('Movie', '')}`),
    ).toThrow('movie titles and language must not be empty');
  });
});
