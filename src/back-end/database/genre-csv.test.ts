import { describe, expect, it } from 'vitest';
import { parseGenresCsv } from './genre-csv';

describe('parseGenresCsv', () => {
  it('parses case-insensitive headers in either order, BOM, CRLF, and quoted values', () => {
    const csv =
      '\uFEFFNAME,ID\r\n"Science, Fiction",878\r\n"Drama ""classic""",18\r\n';

    expect(parseGenresCsv(csv)).toEqual([
      { id: 878, name: 'Science, Fiction' },
      { id: 18, name: 'Drama "classic"' },
    ]);
  });

  it('ignores empty lines', () => {
    expect(parseGenresCsv('id,name\n\n18,Drama\n\n')).toEqual([
      { id: 18, name: 'Drama' },
    ]);
  });

  it('rejects invalid headers', () => {
    expect(() => parseGenresCsv('id,label\n18,Drama')).toThrow(
      'headers must be exactly id and name',
    );
    expect(() => parseGenresCsv('id,name,extra\n18,Drama,unused')).toThrow(
      'headers must be exactly id and name',
    );
  });

  it('rejects invalid identifiers and empty names', () => {
    expect(() => parseGenresCsv('id,name\n0,Drama')).toThrow(
      'id must be a positive safe integer',
    );
    expect(() => parseGenresCsv('id,name\n9007199254740992,Drama')).toThrow(
      'id must be a positive safe integer',
    );
    expect(() => parseGenresCsv('id,name\n18,   ')).toThrow(
      'name must not be empty',
    );
  });

  it('rejects malformed CSV and missing headers', () => {
    expect(() => parseGenresCsv('id,name\n18,"Drama')).toThrow(
      'Invalid genres CSV:',
    );
    expect(() => parseGenresCsv('')).toThrow(
      'the id and name headers are required',
    );
  });
});
