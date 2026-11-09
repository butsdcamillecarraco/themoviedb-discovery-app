import { execFileSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';

const cliPath = resolve('src/back-end/backend-cli.ts');

function runCli(args: string[]): string {
  return execFileSync(
    process.execPath,
    ['--import', 'tsx/esm', cliPath, ...args],
    { encoding: 'utf8' },
  );
}

describe('backend CLI genre commands', () => {
  it('imports genres into the selected database and reports the count', () => {
    const directory = mkdtempSync(join(tmpdir(), 'genres-cli-'));
    const databasePath = join(directory, 'custom.sqlite');
    const csvPath = join(directory, 'genres.csv');
    writeFileSync(csvPath, 'name,id\nDrama,18\nComedy,35\nDrama updated,18\n');

    expect(runCli(['--path', databasePath, 'add-genres', csvPath])).toBe(
      `Imported 3 genres into ${resolve(databasePath)}\n`,
    );

    const database = new DatabaseSync(databasePath);
    try {
      expect(
        database.prepare('SELECT id, name FROM genres ORDER BY id').all(),
      ).toEqual([
        { id: 18, name: 'Drama updated' },
        { id: 35, name: 'Comedy' },
      ]);
    } finally {
      database.close();
    }
  });

  it('validates the CSV before creating the selected database', () => {
    const directory = mkdtempSync(join(tmpdir(), 'genres-cli-'));
    const databasePath = join(directory, 'not-created.sqlite');
    const csvPath = join(directory, 'invalid.csv');
    writeFileSync(csvPath, 'id,label\n18,Drama\n');

    expect(() =>
      runCli(['--path', databasePath, 'add-genres', csvPath]),
    ).toThrow(/headers must be exactly id and name/);
    expect(existsSync(databasePath)).toBe(false);
  });

  it('removes only unreferenced genres and reports the count', () => {
    const directory = mkdtempSync(join(tmpdir(), 'genres-cli-'));
    const databasePath = join(directory, 'custom.sqlite');
    const createOutput = runCli(['create-database', '--path', databasePath]);
    expect(createOutput).toBe(
      `Database available at ${resolve(databasePath)}\n`,
    );

    const database = new DatabaseSync(databasePath);
    database
      .prepare('INSERT INTO genres (id, name) VALUES (?, ?), (?, ?)')
      .run(18, 'Drama', 35, 'Comedy');
    database
      .prepare(
        'INSERT INTO movies (id, title, original_title, original_language, overview, collected_at) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .run(1, 'Movie', 'Movie', 'en', 'Overview', '2026-01-01');
    database
      .prepare('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)')
      .run(1, 18);
    database.close();

    expect(runCli(['--path', databasePath, 'clean-genres'])).toBe(
      `Removed 1 genres from ${resolve(databasePath)}\n`,
    );

    const verifiedDatabase = new DatabaseSync(databasePath);
    try {
      expect(verifiedDatabase.prepare('SELECT id FROM genres').all()).toEqual([
        { id: 18 },
      ]);
    } finally {
      verifiedDatabase.close();
    }
  });
});
