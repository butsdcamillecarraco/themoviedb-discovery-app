import { describe, expect, it } from 'vitest';
import * as utils from './utils';

describe('utils', () => {
  it('can be imported', () => {
    expect(utils).toBeDefined();
  });

  it('only exposes defined values', () => {
    for (const [name, value] of Object.entries(utils)) {
      expect(value, `${name} should be defined`).not.toBeUndefined();
    }
  });

  it('does not expose invalid export names', () => {
    for (const name of Object.keys(utils)) {
      expect(name).toMatch(/^[A-Za-z_$][\w$]*$/);
    }
  });
});
