import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('versioned Firebase environments', () => {
  it('[ENV-01.3] environment files are tracked, typed and credential-free', () => {
    const gitignore = read('.gitignore');
    expect(gitignore).not.toMatch(/^src\/environments\/environment\.ts$/m);
    expect(gitignore).not.toMatch(
      /^src\/environments\/environment\.prod\.ts$/m,
    );
    expect(existsSync(resolve(root, 'src/environments/environment.ts'))).toBe(
      true,
    );
    expect(
      existsSync(resolve(root, 'src/environments/environment.prod.ts')),
    ).toBe(true);

    const development = read('src/environments/environment.ts');
    const production = read('src/environments/environment.prod.ts');
    for (const source of [development, production]) {
      expect(source).toContain('AppEnvironment');
      expect(source).toContain('remoteConfigFetchIntervalMs');
      expect(source).not.toMatch(/apiKey|AIza|appId|password|secret/i);
    }
    expect(development).toMatch(/production:\s*false/);
    expect(production).toMatch(/production:\s*true/);
    expect(
      existsSync(resolve(root, 'src/environments/environment.example.ts')),
    ).toBe(false);
    expect(existsSync(resolve(root, 'scripts/ensure-environment.cjs'))).toBe(
      false,
    );
  });

  it('[RC-06.2] production fetch interval is an integer between 0 and 60000 ms', () => {
    const production = read('src/environments/environment.prod.ts');
    const match = production.match(/remoteConfigFetchIntervalMs:\s*(\d[\d_]*)/);
    expect(match).not.toBeNull();
    const interval = Number(match?.[1].replaceAll('_', ''));
    expect(Number.isInteger(interval)).toBe(true);
    expect(interval).toBeGreaterThanOrEqual(0);
    expect(interval).toBeLessThanOrEqual(60_000);
  });
});
