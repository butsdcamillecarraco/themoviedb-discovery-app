import { parse } from 'csv-parse/sync';
import type { Genre } from './genre-repository.ts';

const REQUIRED_HEADERS = ['id', 'name'] as const;

/**
 * Parses and validates a CSV containing genre identifiers and names.
 */
export function parseGenresCsv(csv: string): Genre[] {
  let rows: string[][];

  try {
    rows = parse(csv, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: false,
    }) as string[][];
  } catch (error) {
    throw new Error(`Invalid genres CSV: ${String(error)}`, { cause: error });
  }

  if (rows.length === 0) {
    throw new Error('Invalid genres CSV: the id and name headers are required');
  }

  const headers = rows[0].map((header) => header.toLowerCase());
  if (
    headers.length !== REQUIRED_HEADERS.length ||
    new Set(headers).size !== REQUIRED_HEADERS.length ||
    !REQUIRED_HEADERS.every((header) => headers.includes(header))
  ) {
    throw new Error('Invalid genres CSV: headers must be exactly id and name');
  }

  const idIndex = headers.indexOf('id');
  const nameIndex = headers.indexOf('name');

  return rows.slice(1).map((row, rowIndex) => {
    const lineNumber = rowIndex + 2;
    const idValue = row[idIndex];
    const nameValue = row[nameIndex];

    if (!/^[1-9]\d*$/.test(idValue)) {
      throw new Error(
        `Invalid genres CSV at line ${lineNumber}: id must be a positive safe integer`,
      );
    }

    const id = Number(idValue);
    if (!Number.isSafeInteger(id)) {
      throw new Error(
        `Invalid genres CSV at line ${lineNumber}: id must be a positive safe integer`,
      );
    }

    if (nameValue.trim() === '') {
      throw new Error(
        `Invalid genres CSV at line ${lineNumber}: name must not be empty`,
      );
    }

    return { id, name: nameValue };
  });
}
