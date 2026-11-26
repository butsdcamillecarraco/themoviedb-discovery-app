import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DATABASE_PATH = '/tmp/movies-default.sqlite';

const closeMock = vi.fn();
const execMock = vi.fn();
const runMock = vi.fn(() => ({ changes: 2 }));
const prepareMock = vi.fn(() => ({ run: runMock }));
const getDatabaseMock = vi.fn(() => ({
  close: closeMock,
  exec: execMock,
  prepare: prepareMock,
}));
const readFileSyncMock = vi.fn(() => 'id,name\n18,Drama\n');
const parseGenresCsvMock = vi.fn(() => [{ id: 18, name: 'Drama' }]);
const upsertGenresMock = vi.fn();
const updateMoviesDatabaseMock = vi.fn();

vi.mock('./database/schema.ts', () => ({
  DEFAULT_DATABASE_PATH,
  getDatabase: getDatabaseMock,
}));
vi.mock('node:fs', () => ({ readFileSync: readFileSyncMock }));
vi.mock('./database/genre-csv.ts', () => ({
  parseGenresCsv: parseGenresCsvMock,
}));
vi.mock('./database/genre-repository.ts', () => ({
  upsertGenres: upsertGenresMock,
}));
vi.mock('./database/update-service.ts', () => ({
  updateMoviesDatabase: updateMoviesDatabaseMock,
}));

/**
 * Executes the backend CLI with the specified command-line arguments
 * @param args The command-line arguments to pass to the CLI
 */
async function runCliWithArgs(args: string[]): Promise<void> {
  const originalArgv = process.argv;
  process.argv = ['node', 'src/back-end/backend-cli.ts', ...args];
  try {
    await import('./backend-cli.ts');
  } finally {
    process.argv = originalArgv;
  }
}

describe('backend-cli.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    prepareMock.mockReturnValue({ run: runMock });
    runMock.mockReturnValue({ changes: 2 });
    readFileSyncMock.mockReturnValue('id,name\n18,Drama\n');
    parseGenresCsvMock.mockReturnValue([{ id: 18, name: 'Drama' }]);
    upsertGenresMock.mockImplementation(() => {});
    updateMoviesDatabaseMock.mockResolvedValue(3);
  });

  describe('create-database', () => {
    it('uses the default database path when the subcommand has no path option', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await runCliWithArgs(['create-database']);

        expect(getDatabaseMock).toHaveBeenCalledWith(DEFAULT_DATABASE_PATH);
        expect(logSpy).toHaveBeenCalledWith(
          `Database available at ${resolve(DEFAULT_DATABASE_PATH)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('uses the path passed in --path', async () => {
      const customDatabasePath = './data/custom-movies.sqlite';
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await runCliWithArgs(['create-database', '--path', customDatabasePath]);

        expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
        expect(logSpy).toHaveBeenCalledWith(
          `Database available at ${resolve(customDatabasePath)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });
  });

  describe('add-genres', () => {
    it('validates the file before opening the database and imports it transactionally', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const customDatabasePath = './data/custom-movies.sqlite';
      try {
        await runCliWithArgs([
          '--path',
          customDatabasePath,
          'add-genres',
          './data/genres.csv',
        ]);

        expect(readFileSyncMock).toHaveBeenCalledWith(
          './data/genres.csv',
          'utf8',
        );
        expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
        expect(execMock).toHaveBeenNthCalledWith(1, 'BEGIN TRANSACTION');
        expect(upsertGenresMock).toHaveBeenCalledWith(
          expect.objectContaining({ exec: execMock }),
          [{ id: 18, name: 'Drama' }],
        );
        expect(execMock).toHaveBeenNthCalledWith(2, 'COMMIT');
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          `Imported 1 genres into ${resolve(customDatabasePath)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('rolls back and closes the database when the import fails', async () => {
      upsertGenresMock.mockImplementation(() => {
        throw new Error('import failed');
      });

      await expect(
        runCliWithArgs(['add-genres', './data/genres.csv']),
      ).rejects.toThrow('import failed');

      expect(execMock).toHaveBeenNthCalledWith(1, 'BEGIN TRANSACTION');
      expect(execMock).toHaveBeenNthCalledWith(2, 'ROLLBACK');
      expect(closeMock).toHaveBeenCalledOnce();
    });
  });

  describe('clean-genres', () => {
    it('deletes unused genres and reports the number of deleted rows', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await runCliWithArgs(['clean-genres']);

        expect(prepareMock).toHaveBeenCalledWith(
          'DELETE FROM genres WHERE NOT EXISTS (SELECT 1 FROM movie_genres WHERE movie_genres.genre_id = genres.id)',
        );
        expect(runMock).toHaveBeenCalledOnce();
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          `Removed 2 genres from ${resolve(DEFAULT_DATABASE_PATH)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    describe('update-database', () => {
      it('updates the selected database and reports the movie count', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        try {
          await runCliWithArgs([
            'update-database',
            '--year',
            '2020',
            '--path',
            './data/custom-movies.sqlite',
          ]);
          await new Promise((resolve) => setImmediate(resolve));

          expect(logSpy).toHaveBeenCalledWith(
            `Updated 3 movies in ${resolve('./data/custom-movies.sqlite')}`,
          );
        } finally {
          logSpy.mockRestore();
        }
      });

      it('rejects a year that is not four digits', async () => {
        const unhandledRejection = vi.fn();
        process.once('unhandledRejection', unhandledRejection);
        await runCliWithArgs(['update-database', '--year', '20']);
        await new Promise((resolve) => setImmediate(resolve));
        process.removeListener('unhandledRejection', unhandledRejection);

        expect(unhandledRejection).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Year must be a four-digit number',
          }),
          expect.any(Promise),
        );
        expect(getDatabaseMock).not.toHaveBeenCalled();
      });
    });
  });
});
