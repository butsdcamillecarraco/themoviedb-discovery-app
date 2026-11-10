import { describe, expect, it } from 'vitest';
import { parseCountriesCsv } from './country-csv';

describe('parseCountriesCsv', () => {
  it('parses case-insensitive headers in either order, BOM, CRLF, and quoted values', () => {
    const csv = '\uFEFFNAME,CODE\r\n"UNITED KINGDOM",GB\r\n"FRANCE",FR\r\n';

    expect(parseCountriesCsv(csv)).toEqual([
      { code: 'GB', name: 'UNITED KINGDOM' },
      { code: 'FR', name: 'FRANCE' },
    ]);
  });

  it('ignores empty lines', () => {
    expect(parseCountriesCsv('code,name\n\nFR,FRANCE\n\n')).toEqual([
      { code: 'FR', name: 'FRANCE' },
    ]);
  });

  it('rejects invalid headers', () => {
    expect(() => parseCountriesCsv('code,label\nFRANCE,France')).toThrow(
      'headers must be exactly code and name',
    );
    expect(() =>
      parseCountriesCsv('code,name,extra\nFR,FRANCE,unused'),
    ).toThrow('headers must be exactly code and name');
  });

  it('rejects empty codes and names', () => {
    expect(() => parseCountriesCsv('code,name\n,FRANCE')).toThrow(
      'code must not be empty',
    );
    expect(() => parseCountriesCsv('code,name\nFR,   ')).toThrow(
      'name must not be empty',
    );
  });

  it('rejects malformed CSV and missing headers', () => {
    expect(() => parseCountriesCsv('code,name\nFR,"France')).toThrow(
      'Invalid countries CSV:',
    );
    expect(() => parseCountriesCsv('')).toThrow(
      'the code and name headers are required',
    );
  });
});
