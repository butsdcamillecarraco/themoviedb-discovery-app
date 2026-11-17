#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_DATABASE_PATH, getDatabase } from './database/schema.ts';
import { parseGenresCsv } from './database/genre-csv.ts';
import { upsertGenres } from './database/genre-repository.ts';

/** Command-line interface for movie database operations. */
const program = new Command()
  .description('CLI for movie database operations')
  .option('-p, --path <path>', 'path to the SQLite database file');

function getDatabasePath(commandPath?: string): string {
  return (
    commandPath ??
    program.opts<{ path?: string }>().path ??
    DEFAULT_DATABASE_PATH
  );
}

program
  .command('create-database')
  .description('Create and initialize the movies database schema')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(({ path }: { path: string }) => {
    const database = getDatabase(getDatabasePath(path));
    database.close();
    console.log(`Database available at ${resolve(getDatabasePath(path))}`);
  });

program
  .command('add-genres <csv-file>')
  .description('Import genres from a CSV file')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action((csvFile: string, { path }: { path?: string }) => {
    const genres = parseGenresCsv(readFileSync(csvFile, 'utf8'));
    const databasePath = getDatabasePath(path);
    const database = getDatabase(databasePath);

    try {
      database.exec('BEGIN TRANSACTION');
      try {
        upsertGenres(database, genres);
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
      console.log(
        `Imported ${genres.length} genres into ${resolve(databasePath)}`,
      );
    } finally {
      database.close();
    }
  });

program
  .command('clean-genres')
  .description('Remove genres that are not associated with a movie')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(({ path }: { path?: string }) => {
    const databasePath = getDatabasePath(path);
    const database = getDatabase(databasePath);

    try {
      const result = database
        .prepare(
          'DELETE FROM genres WHERE NOT EXISTS (SELECT 1 FROM movie_genres WHERE movie_genres.genre_id = genres.id)',
        )
        .run();
      console.log(
        `Removed ${result.changes} genres from ${resolve(databasePath)}`,
      );
    } finally {
      database.close();
    }
  });

program.parse();
