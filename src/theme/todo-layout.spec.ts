import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readAppStyles(relativePath: string): string {
  return readFileSync(resolve(__dirname, '../app', relativePath), 'utf8');
}

describe('Todo layout regression contracts', () => {
  it('[TODO-01.1] keeps the nested Ionic outlet in the flex layout conforme a Figma 4:440', () => {
    const styles = readAppStyles('layout/shell/shell.component.scss');
    expect(styles).toMatch(/ion-router-outlet\s*\{[^}]*position:\s*relative;/);
    expect(styles).toMatch(/\.shell\s*\{[^}]*\sheight:\s*100%;/);
  });

  it('[TODO-01.2] gives the day heading priority over generic notebook typography conforme a Figma 4:440', () => {
    const styles = readAppStyles(
      'shared/components/page-header/page-header.component.scss',
    );
    expect(styles).toMatch(
      /h1\.date\s*\{[^}]*font-size:\s*var\(--app-font-size-date\);/,
    );
  });

  it('[TODO-03.1] keeps the visible task checkbox square without the form input minimum conforme a Figma 4:664', () => {
    const styles = readAppStyles(
      'shared/components/task-item/task-item.component.scss',
    );
    expect(styles).toMatch(/input\s*\{[^}]*min-height:\s*0;/);
    expect(styles).toMatch(/input\s*\{[^}]*padding:\s*0;/);
  });

  it('[TODO-02.1] compensates absolute panel and FAB coordinates for the rail conforme a Figma 4:440', () => {
    const styles = readAppStyles('pages/tasks/tasks.page.scss');
    expect(styles).toMatch(/left:\s*calc\(292px - var\(--app-rail-width\)\);/);
    expect(styles).toMatch(
      /margin-left:\s*calc\(0px - var\(--app-rail-width\)\);/,
    );
    expect(styles).toMatch(/ion-fab-button\s*\{[^}]*width:\s*100%;/);
    expect(styles).toMatch(/ion-fab-button\s*\{[^}]*height:\s*100%;/);
  });

  it('[TODO-05.1] centers the empty-state content conforme a Figma 4:1062', () => {
    const styles = readAppStyles(
      'shared/components/empty-state/empty-state.component.scss',
    );
    expect(styles).toMatch(/\.empty-state\s*\{[^}]*align-items:\s*center;/);
    expect(styles).toMatch(/\.empty-state\s*\{[^}]*text-align:\s*center;/);
  });
});
