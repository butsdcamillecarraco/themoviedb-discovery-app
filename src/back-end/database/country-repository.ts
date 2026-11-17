import type { DatabaseSync } from 'node:sqlite';

export type Country = {
  code: string;
  name: string;
};

/**
 * Finds a country by its identifier.
 */
export function findCountryById(
  database: DatabaseSync,
  code: string,
): Country | undefined {
  return database
    .prepare('SELECT code, name FROM countries WHERE code = ?')
    .get(code) as Country | undefined;
}

/**
 * Lists all countries ordered by their identifier.
 */
export function listCountries(database: DatabaseSync): Country[] {
  return database
    .prepare('SELECT code, name FROM countries ORDER BY code ASC')
    .all() as Country[];
}

/**
 * Inserts or updates countries.
 */
export function upsertCountries(
  database: DatabaseSync,
  countries: Iterable<Country>,
): void {
  const statement = database.prepare(`
    INSERT INTO countries (code, name)
    VALUES (?, ?)
    ON CONFLICT(code) DO UPDATE SET name = excluded.name
  `);

  for (const country of countries) {
    statement.run(country.code, country.name);
  }
}
