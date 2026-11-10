import { parse } from 'csv-parse/sync';
import type { Country } from './country-repository.ts';

const REQUIRED_HEADERS = ['code', 'name'] as const;

/**
 * Parses and validates a CSV containing country identifiers and names.
 */
export function parseCountriesCsv(csv: string): Country[] {
  let rows: string[][];

  try {
    rows = parse(csv, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: false,
    }) as string[][];
  } catch (error) {
    throw new Error(`Invalid countries CSV: ${String(error)}`, {
      cause: error,
    });
  }

  if (rows.length === 0) {
    throw new Error(
      'Invalid countries CSV: the code and name headers are required',
    );
  }

  const headers = rows[0].map((header) => header.toLowerCase());
  if (
    headers.length !== REQUIRED_HEADERS.length ||
    new Set(headers).size !== REQUIRED_HEADERS.length ||
    !REQUIRED_HEADERS.every((header) => headers.includes(header))
  ) {
    throw new Error(
      'Invalid countries CSV: headers must be exactly code and name',
    );
  }

  const idIndex = headers.indexOf('code');
  const nameIndex = headers.indexOf('name');

  return rows.slice(1).map((row, rowIndex) => {
    const lineNumber = rowIndex + 2;
    const code = row[idIndex].trim();
    const nameValue = row[nameIndex];

    if (code === '') {
      throw new Error(
        `Invalid countries CSV at line ${lineNumber}: code must not be empty`,
      );
    }

    if (nameValue.trim() === '') {
      throw new Error(
        `Invalid countries CSV at line ${lineNumber}: name must not be empty`,
      );
    }

    return { code, name: nameValue };
  });
}
