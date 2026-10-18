import * as fs from 'node:fs';
import * as path from 'node:path';

type InheritedToken = {
  name: string;
  value: string;
  origin: 'notebook.scss' | 'Ionic palette' | 'project-bootstrap';
  use: string;
};

const expected: readonly InheritedToken[] = [
  {
    name: '$color-primary',
    value: '#4b3f6b',
    origin: 'notebook.scss',
    use: 'primary brand',
  },
  {
    name: '$color-primary-dark',
    value: '#3a2e5c',
    origin: 'notebook.scss',
    use: 'primary shade',
  },
  {
    name: '$color-accent-link',
    value: '#3aa8e0',
    origin: 'notebook.scss',
    use: 'links',
  },
  {
    name: '$color-danger',
    value: '#c5000f',
    origin: 'Ionic palette',
    use: 'destructive state',
  },
  {
    name: '$color-scrim',
    value: '#00000066',
    origin: 'notebook.scss',
    use: 'backdrop scrim',
  },
  {
    name: '$shadow-card-color',
    value: '#2e254714',
    origin: 'notebook.scss',
    use: 'card shadow',
  },
  {
    name: '$shadow-fab-color',
    value: '#4b3f6b59',
    origin: 'notebook.scss',
    use: 'fab shadow',
  },
  {
    name: '$tab-todo',
    value: '#b8cfa8',
    origin: 'notebook.scss',
    use: 'category color',
  },
  {
    name: '$tab-filler',
    value: '#4b3f6b',
    origin: 'notebook.scss',
    use: 'category filler',
  },
  {
    name: '$space-4',
    value: '4px',
    origin: 'notebook.scss',
    use: 'spacing scale',
  },
  {
    name: '$space-32',
    value: '32px',
    origin: 'notebook.scss',
    use: 'spacing scale',
  },
  {
    name: '$radius-button',
    value: '6px',
    origin: 'notebook.scss',
    use: 'button radius',
  },
  {
    name: '$radius-card',
    value: '10px',
    origin: 'notebook.scss',
    use: 'card radius',
  },
  {
    name: '$radius-accent-underline',
    value: '1.5px',
    origin: 'notebook.scss',
    use: 'page-header accent',
  },
  {
    name: '$stroke-checkbox',
    value: '1.5px',
    origin: 'notebook.scss',
    use: 'checkbox border',
  },
  {
    name: '$primary-shade',
    value: '#3a2e5c',
    origin: 'notebook.scss',
    use: 'derived from primary',
  },
  {
    name: '$primary-tint',
    value: '#5d527a',
    origin: 'notebook.scss',
    use: 'derived from primary',
  },
];

function readTokensScss(): string {
  return fs.readFileSync(path.join(__dirname, '_tokens.scss'), 'utf8');
}

function readReadme(): string {
  return fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
}

describe('Inherited technical tokens table (UI-20.1)', () => {
  const tokensScss = readTokensScss();
  const readme = readReadme();

  it.each(expected)(
    'declares $name in _tokens.scss with the recorded value',
    (token) => {
      const expectedLine = `${token.name}: ${token.value};`;
      expect(tokensScss).toContain(expectedLine);
    },
  );

  it.each(expected)(
    'documents $name in README with origin and use',
    (token) => {
      expect(readme).toContain(token.name);
      expect(readme).toContain(token.origin);
      expect(readme.toLowerCase()).toContain(token.use.toLowerCase());
    },
  );

  it('classifies each token as inherited (not Figma)', () => {
    const headerLine = readme
      .split('\n')
      .find(
        (line) =>
          line.toLowerCase().includes('inherited') ||
          line.toLowerCase().includes('técnicos heredados'),
      );
    expect(headerLine).toBeDefined();
  });
});
