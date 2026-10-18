import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

function flatten(value: object, prefix = ''): [string, unknown][] {
  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === 'object') {
      return flatten(nested, path);
    }
    return [[path, nested] as [string, unknown]];
  });
}

function readTemplate(relativePath: string): string {
  return readFileSync(join(__dirname, '../../..', relativePath), 'utf8');
}

const TEMPLATES = [
  'app/layout/shell/side-tab-rail.component.html',
  'app/layout/shell/shell.component.ts',
  'app/pages/categories/categories.page.html',
  'app/shared/components/category-sheet/category-sheet.component.html',
  'app/shared/components/task-item/task-item.component.html',
  'app/pages/tasks/tasks.page.html',
];

describe('Chrome translations', () => {
  const spanish = Object.fromEntries(flatten(es));
  const english = Object.fromEntries(flatten(en));

  it.each(TEMPLATES)(
    '[I18N-01.4] %s declares no user-facing literal outside the locale files',
    (relativePath) => {
      const template = readTemplate(relativePath);
      const literals = [
        ...template.matchAll(
          />\s*([^<>{}]*[A-Za-zÁÉÍÓÚáéíóúÑñ]{3,}[^<>{}]*)\s*</g,
        ),
      ]
        .map((match) => match[1].trim())
        .filter(
          (literal) =>
            !literal.includes('{{') && !literal.includes('|') && literal !== '',
        );
      expect(literals).toEqual([]);
    },
  );

  it.each([
    ['app/layout/shell/side-tab-rail.component.html', 'rail.label'],
    ['app/layout/shell/shell.component.ts', 'shell.retry'],
    ['app/pages/categories/categories.page.html', 'category.title'],
    [
      'app/shared/components/category-sheet/category-sheet.component.html',
      'category.sheet.name',
    ],
    [
      'app/shared/components/task-item/task-item.component.html',
      'task.deleteAction',
    ],
    ['app/pages/tasks/tasks.page.html', 'todo.editor.title'],
  ])('%s resolves %s in both locales', (relativePath, key) => {
    expect(readTemplate(relativePath)).toContain(key);
    expect(spanish[key]).toEqual(expect.any(String));
    expect(english[key]).toEqual(expect.any(String));
  });

  it('[I18N-01.4] keeps the rail, shell, sheet, row and editor keys aligned between locales', () => {
    const prefixes = ['rail', 'shell', 'category', 'notes', 'task', 'todo'];
    const keysUnder = (locale: Record<string, unknown>, prefix: string) =>
      Object.keys(locale).filter(
        (key) => key === prefix || key.startsWith(`${prefix}.`),
      );
    const spanishKeys = prefixes
      .flatMap((prefix) => keysUnder(spanish, prefix))
      .sort();
    expect(spanishKeys.length).toBeGreaterThan(0);
    expect(spanishKeys).toEqual(
      prefixes.flatMap((prefix) => keysUnder(english, prefix)).sort(),
    );
  });

  it('[TODAY-UI-01.2] keeps the chevron out of the translatable label', () => {
    expect(spanish['todo.today']).toBe('HOY');
    expect(english['todo.today']).toBe('TODAY');
    expect(spanish['todo.today']).not.toContain('›');
    expect(english['todo.today']).not.toContain('›');
  });

  it('[CAT-UI-01.1] resolves the empty state action label in both locales', () => {
    expect(spanish['category.emptyAction']).toEqual(expect.any(String));
    expect(english['category.emptyAction']).toEqual(expect.any(String));
  });
});
