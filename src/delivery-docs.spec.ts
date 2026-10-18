import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function firebaseSection(readme: string): string {
  const start = readme.indexOf('## Firebase y Remote Config');
  const next = readme.indexOf('\n## ', start + 1);
  return start === -1
    ? ''
    : readme.slice(start, next === -1 ? undefined : next);
}

describe('Firebase delivery docs', () => {
  it('[DOC-FB-01.1] README documents the Firebase project and parameters', () => {
    const section = firebaseSection(read('README.md'));
    expect(section).toContain('## Firebase y Remote Config');
    expect(section).toContain('to-do-pragma');
    expect(section).toContain('enable_debug_actions');
    expect(section).toContain('enable_categories');
    expect(section).toMatch(/enable_debug_actions[\s\S]*BOOLEAN[\s\S]*false/);
    expect(section).toMatch(/enable_categories[\s\S]*BOOLEAN[\s\S]*true/);
  });

  it('[DOC-FB-01.2] README explains where the config goes without committing it', () => {
    const section = firebaseSection(read('README.md'));
    expect(section).toContain('src/assets/firebase-config.json');
    expect(section).toContain('firebase-config.example.json');
    expect(section).toContain('FIREBASE_');
    expect(section).toContain('.gitignore');
  });

  it('[DOC-FB-01.3] README explains how to change the flag for the demo', () => {
    const section = firebaseSection(read('README.md'));
    expect(section).toContain(
      'https://console.firebase.google.com/project/to-do-pragma/config',
    );
    expect(section).toContain('Publicar cambios');
    expect(section.toLowerCase()).toMatch(/reinici/);
  });

  it('[DOC-FB-01.4] README does not expose a real Firebase config', () => {
    const readme = read('README.md');
    expect(readme).not.toMatch(/AIza/);
    expect(readme).not.toMatch(/1:\d+:web:[0-9a-f]+/i);
    expect(readme).not.toMatch(/messagingSenderId["']?\s*[:=]\s*["']?\d{6,}/);
  });

  it('[DOC-FB-01.5] drops the false copy about OpenSpec and virtual scroll', () => {
    expect(read('README.md')).not.toContain('No hay changes activos');
    expect(read('src/assets/i18n/es.json')).not.toContain('virtual scroll');
    expect(read('src/assets/i18n/en.json')).not.toContain('virtual scroll');
  });

  it('[DOC-FB-01.6] README OpenSpec status matches the active changes on disk', () => {
    const changes = readdirSync(resolve(root, 'openspec/changes'), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory() && entry.name !== 'archive')
      .map((entry) => entry.name);
    const readme = read('README.md');
    const start = readme.indexOf('## Estado OpenSpec');
    expect(start).toBeGreaterThanOrEqual(0);
    const next = readme.indexOf('\n## ', start + 1);
    const section = readme.slice(start, next === -1 ? undefined : next);
    // WIP=1 allows zero active changes between changes. The README has to say so
    // instead of naming a change that is already archived.
    const saysNone = section.includes('Changes activos: ninguno');
    expect(saysNone).toBe(changes.length === 0);
    for (const name of changes) {
      expect(section).toContain(name);
    }
  });
});
