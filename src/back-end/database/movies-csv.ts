import { parse } from 'csv-parse/sync';
import type { DatabaseSync } from 'node:sqlite';
import { upsertMovies, type Movie } from './movies-repository';

const REQUIRED_HEADERS = [
  'id',
  'title',
  'original_title',
  'original_language',
  'overview',
  'release_date',
  'popularity',
  'vote_average',
  'vote_count',
  'poster_path',
  'backdrop_path',
  'runtime',
  'budget',
  'revenue',
] as const;
const OPTIONAL_HEADERS = ['genres', 'production_countries'] as const;

function parseNumber(
  value: string,
  field: string,
  line: number,
  integer = false,
): number {
  const parsed = Number(value.trim());
  if (
    value.trim() === '' ||
    !Number.isFinite(parsed) ||
    (integer && !Number.isInteger(parsed))
  ) {
    throw new Error(
      `Invalid movies CSV at line ${line}: ${field} must be a valid number`,
    );
  }
  return parsed;
}

function parseDate(value: string, line: number): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    throw new Error(
      `Invalid movies CSV at line ${line}: release_date must be YYYY-MM-DD`,
    );
  }
  const date = new Date(`${value.trim()}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Invalid movies CSV at line ${line}: release_date must be a valid date`,
    );
  }
  return date;
}

/** Parses and validates a CSV containing movie information. */
export function parseMoviesCsv(csv: string): Movie[] {
  let rows: string[][];
  try {
    rows = parse(csv, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: false,
    }) as string[][];
  } catch (error) {
    throw new Error(`Invalid movies CSV: ${String(error)}`, { cause: error });
  }

  if (rows.length === 0) {
    throw new Error('Invalid movies CSV: the movie headers are required');
  }

  const headers = rows[0].map((header) => header.toLowerCase());
  const expectedHeaders = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];
  const hasOptionalHeaders =
    headers.includes('genres') || headers.includes('production_countries');
  if (
    (headers.length !== REQUIRED_HEADERS.length &&
      headers.length !== expectedHeaders.length) ||
    new Set(headers).size !== headers.length ||
    !REQUIRED_HEADERS.every((header) => headers.includes(header)) ||
    (hasOptionalHeaders &&
      !OPTIONAL_HEADERS.every((header) => headers.includes(header)))
  ) {
    throw new Error(
      'Invalid movies CSV: headers must contain the movie fields',
    );
  }

  const index = (header: string): number => headers.indexOf(header);
  return rows.slice(1).map((row, rowIndex) => {
    const line = rowIndex + 2;
    const text = (field: string): string => row[index(field)].trim();
    const title = text('title');
    const originalTitle = text('original_title');
    const originalLanguage = text('original_language');
    if (title === '' || originalTitle === '' || originalLanguage === '') {
      throw new Error(
        `Invalid movies CSV at line ${line}: movie titles and language must not be empty`,
      );
    }

    return {
      id: parseNumber(text('id'), 'id', line, true),
      title,
      original_title: originalTitle,
      original_language: originalLanguage,
      overview: text('overview'),
      release_date: parseDate(text('release_date'), line),
      popularity: parseNumber(text('popularity'), 'popularity', line),
      vote_average: parseNumber(text('vote_average'), 'vote_average', line),
      vote_count: parseNumber(text('vote_count'), 'vote_count', line, true),
      poster_path: text('poster_path'),
      backdrop_path: text('backdrop_path'),
      runtime: parseNumber(text('runtime'), 'runtime', line, true),
      budget: parseNumber(text('budget'), 'budget', line, true),
      revenue: parseNumber(text('revenue'), 'revenue', line, true),
    };
  });
}

/** Imports movies from CSV and inserts or updates them in the database. */
export function importMoviesCsv(database: DatabaseSync, csv: string): void {
  upsertMovies(database, parseMoviesCsv(csv));
}
