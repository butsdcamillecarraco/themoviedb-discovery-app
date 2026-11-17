import type { DatabaseSync } from 'node:sqlite';

export type Genre = {
  id: number;
  name: string;
};

/**
 * Finds a genre by its identifier.
 */
export function findGenreById(
  database: DatabaseSync,
  id: number,
): Genre | undefined {
  return database
    .prepare('SELECT id, name FROM genres WHERE id = ?')
    .get(id) as Genre | undefined;
}

/**
 * Lists all genres ordered by their identifier.
 */
export function listGenres(database: DatabaseSync): Genre[] {
  return database
    .prepare('SELECT id, name FROM genres ORDER BY id ASC')
    .all() as Genre[];
}

/**
 * Inserts or updates genres.
 */
export function upsertGenres(
  database: DatabaseSync,
  genres: Iterable<Genre>,
): void {
  const statement = database.prepare(`
    INSERT INTO genres (id, name)
    VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name
  `);

  for (const genre of genres) {
    statement.run(genre.id, genre.name);
  }
}
