import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(__dirname, '..');

function readTextFiles(directory: string, extension: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(directory)) {
    if (name === 'archive') {
      continue;
    }
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      files.push(...readTextFiles(path, extension));
      continue;
    }
    if (path.endsWith(extension)) {
      files.push(readFileSync(path, 'utf8'));
    }
  }
  return files;
}

const REQUIREMENT_ID = /^### Requirement: ([A-Z]{2,}(?:-[A-Z0-9]+)+)\b/gm;
const SCENARIO_ID =
  /^#### Scenario: \[([A-Z]{2,}(?:-[A-Z0-9]+)+(?:\.\d+)?)\]/gm;
const CITED_ID = /\[([A-Z]{2,}(?:-[A-Z0-9]+)+(?:\.\d+)?)\]/g;
const DELTA_SECTION = /^## (ADDED|MODIFIED|REMOVED|RENAMED) Requirements$/gm;

function ids(pattern: RegExp, sources: string[]): string[] {
  return sources.flatMap((source) =>
    [...source.matchAll(pattern)].map((match) => match[1]),
  );
}

// A MODIFIED or REMOVED delta restates ids that already live in openspec/specs.
// Counting those as new definitions would report every legitimate delta as a
// duplicate, so only ADDED blocks introduce ids into a change.
function addedBlocks(source: string): string {
  const sections = [...source.matchAll(DELTA_SECTION)];
  return sections
    .filter((match) => match[1] === 'ADDED')
    .map((match) => source.slice(match.index))
    .join('\n');
}

function definitionsOf(sources: string[]): string[] {
  return sources.flatMap(addedBlocks);
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      repeated.add(value);
    }
    seen.add(value);
  }
  return [...repeated];
}

describe('OpenSpec identifiers', () => {
  const specSources = [
    ...readTextFiles(resolve(root, 'openspec/specs'), '.md'),
    ...readTextFiles(resolve(root, 'openspec/changes'), '.md'),
  ];
  const testSources = readTextFiles(resolve(root, 'src'), '.spec.ts');

  it('[SPEC-01.1] requirement and scenario ids are unique across specs and active changes', () => {
    const specFiles = readTextFiles(resolve(root, 'openspec/specs'), '.md');
    const changeFiles = readTextFiles(resolve(root, 'openspec/changes'), '.md');
    // Un id vive en un solo sitio: en openspec/specs o en un bloque ADDED de un
    // change. Un delta MODIFIED repite ids ya publicados a propósito.
    const requirements = [
      ...ids(REQUIREMENT_ID, specFiles),
      ...ids(REQUIREMENT_ID, definitionsOf(changeFiles)),
    ];
    const scenarios = [
      ...ids(SCENARIO_ID, specFiles),
      ...ids(SCENARIO_ID, definitionsOf(changeFiles)),
    ];
    expect(duplicates(requirements)).toEqual([]);
    expect(duplicates(scenarios)).toEqual([]);
  });

  it('[SPEC-01.2] every id cited by a test exists in a spec', () => {
    const cited = new Set(ids(CITED_ID, testSources));
    const defined = specSources.join('\n');
    // These titles shipped before a Requirement/Scenario header existed.
    // They stay as tests. They are not a second definition of another id.
    // SPEC-01.* are this file. Archive skips the change that only mentioned them.
    const exceptions = new Set([
      'SPEC-01.1',
      'SPEC-01.2',
      'SPEC-01.3',
      'DATA-SEC-01.1',
      'NAV-SEC-01.1',
      'NAV-SEC-01.2',
      'NAV-SEC-01.3',
      'CAT-SEC-02.1',
      'NAV-SEC-02.1',
      'SET-02.2',
      'SHEET-05.5',
      'FAB-01.1',
      'FAB-01.2',
      'FAB-01.3',
      'FAB-01.4',
      'TSK-19.2',
    ]);
    const missing = [...cited].filter(
      (id) => !exceptions.has(id) && !defined.includes(id),
    );
    expect(missing).toEqual([]);
  });

  it('[SPEC-01.3] every retroactive scenario is covered by a test', () => {
    const retro = readTextFiles(
      resolve(root, 'openspec/specs/direct-commits'),
      '.md',
    );
    const scenarios = ids(/^#### Scenario: \[([A-Z][A-Z0-9.-]*)\]/gm, retro);
    const tests = testSources.join('\n');
    const missing = scenarios.filter((id) => !tests.includes(`[${id}]`));
    expect(scenarios.length).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });
});
