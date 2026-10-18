import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readAppStyles(relativePath: string): string {
  return readFileSync(resolve(__dirname, '../app', relativePath), 'utf8');
}

describe('Todo layout regression contracts', () => {
  it('[TODO-04.1] gives task category a circular dot with the category tint conforme a Figma 4:973', () => {
    const styles = readAppStyles(
      'shared/components/task-item/task-item.component.scss',
    );
    expect(styles).toMatch(/border-radius:\s*var\(--app-radius-pill\);/);
    expect(styles).toMatch(/background:\s*var\(--app-category-tint/);
  });

  it('[TODO-04.1] uses pill corners and a separate touch target conforme a Figma 4:973', () => {
    const styles = readAppStyles('shared/components/chip/chip.component.scss');
    expect(styles).toMatch(/border-radius:\s*var\(--app-radius-pill\);/);
    expect(styles).toMatch(/height:\s*var\(--app-chip-height\);/);
    expect(styles).toMatch(/min-height:\s*var\(--app-touch-target\);/);
    expect(styles).toContain('.chip::before');
  });

  it('[TODO-01.1] shares notebook insets while keeping the day and modal variants conforme a Figma 4:440', () => {
    const notebook = readFileSync(resolve(__dirname, '_notebook.scss'), 'utf8');
    const tasks = readAppStyles('pages/tasks/tasks.page.scss');
    const settings = readAppStyles('pages/settings/settings.page.scss');
    const categories = readAppStyles('pages/categories/categories.page.scss');
    expect(notebook).toContain('var(--app-content-page-top)');
    expect(notebook).toContain('var(--app-content-inset-start)');
    expect(tasks).toContain('var(--app-content-day-top)');
    expect(settings).toContain('var(--app-content-inset-end)');
    expect(categories).toContain('var(--app-content-inset-end)');
  });

  it('[TODO-06.2] gives the modal a scrollable notebook container after Ionic reparents it', () => {
    const template = readFileSync(
      resolve(__dirname, '../app/pages/tasks/tasks.page.html'),
      'utf8',
    );
    expect(template).toMatch(
      /<ion-modal[\s\S]*?\[initialBreakpoint\]="0\.9"[\s\S]*?\[breakpoints\]="\[0, 0\.5, 0\.9\]"[\s\S]*?handleBehavior="cycle"[\s\S]*?<ng-template>\s*<ion-content>\s*<section class="notebook-page task-editor">/,
    );
    const styles = readAppStyles('pages/tasks/tasks.page.scss');
    expect(styles).toMatch(
      /\.task-editor\s*\{[^}]*padding:\s*var\(--app-space-24\);/,
    );
  });

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

  it('[TSK-16.1] anchors the shared FAB at right with theme insets, never with left', () => {
    const styles = readAppStyles(
      'shared/components/fab-button/fab-button.component.scss',
    );
    expect(styles).toMatch(/right:\s*calc\(\s*var\(--app-fab-inset-end\)/);
    expect(styles).toMatch(/bottom:\s*calc\(\s*var\(--app-fab-inset-bottom\)/);
    expect(styles).not.toMatch(/left:\s*\d/);
  });

  it.each([
    'pages/tasks/tasks.page.scss',
    'pages/categories/categories.page.scss',
  ])(
    '[TSK-16.1] %s uses the same FAB position as every page (no inset override)',
    (path) => {
      const styles = readAppStyles(path);
      expect(styles).not.toMatch(/--app-fab-inset-(end|bottom)\s*:/);
      expect(styles).not.toMatch(/app-fab-button[^{]*\{[^}]*(right|bottom):/);
    },
  );

  it('[TSK-18.1] keeps infinite scroll between the filters and the pager slot conforme a Figma 4:520', () => {
    const styles = readAppStyles('pages/tasks/tasks.page.scss');
    const template = readFileSync(
      resolve(__dirname, '../app/pages/tasks/tasks.page.html'),
      'utf8',
    );
    expect(styles).toMatch(/main\.notebook-page\s*\{[^}]*display:\s*flex;/);
    expect(styles).toMatch(/main\.notebook-page\s*\{[^}]*[^-]height:\s*100%;/);
    expect(styles).toMatch(
      /main\.notebook-page\s*\{[^}]*padding-bottom:\s*calc\(\s*var\(--app-pager-height\)\s*\+\s*15px\s*\);/,
    );
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*flex:\s*0\s*1\s*60vh;/);
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*max-height:\s*60vh;/);
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*margin-top:\s*20px;/);
    expect(styles).not.toMatch(/\.task-list\s*\{[^}]*overflow-y:\s*auto;/);
    expect(template).toMatch(/<ion-content[^>]*\[scrollY\]="false"/);
    expect(template).toMatch(
      /class="task-scroll"[\s\S]*<ion-content[\s\S]*<ion-infinite-scroll[\s\S]*\(ionInfinite\)="loadMore\(\$event\)"[\s\S]*<ion-infinite-scroll-content/,
    );
    expect(template).toMatch(
      /class="task-scroll"[\s\S]*<\/ion-content>\s*<\/div>\s*@if \(totalPages\(\) > 1\) \{\s*<nav class="pager"/,
    );
    expect(styles).toMatch(/\.pager\s*\{[^}]*position:\s*fixed;/);
    expect(styles).toMatch(
      /\.pager\s*\{[^}]*bottom:\s*env\(safe-area-inset-bottom,\s*0px\);/,
    );
    expect(styles).toMatch(/\.pager\s*\{[^}]*display:\s*flex;/);
    expect(styles).toMatch(/\.pager\s*\{[^}]*flex-wrap:\s*nowrap;/);
    expect(styles).toMatch(
      /\.pager\s*\{[^}]*max-height:\s*var\(--app-pager-height\);/,
    );
    expect(styles).toMatch(/\.pager\s*\{[^}]*margin-bottom:\s*15px;/);
    expect(styles).toMatch(/\.pager\s*\{[^}]*overflow:\s*hidden;/);
    expect(styles).not.toMatch(/\.pager\s*\{[^}]*overflow-x:\s*auto;/);
    expect(styles).toMatch(/\.chips\s*\{[^}]*flex-wrap:\s*wrap;/);
  });

  it('[TODO-04.1] uses the on-primary text token for the selected category conforme a Figma 4:973', () => {
    const styles = readAppStyles('shared/components/chip/chip.component.scss');
    expect(styles).toMatch(
      /\.chip\.selected\s*\{[^}]*color:\s*var\(--app-on-primary\);/,
    );
    expect(styles).toMatch(/:host\s*\{[^}]*flex-shrink:\s*0;/);
    expect(styles).toMatch(/\.chip\s*\{[^}]*white-space:\s*nowrap;/);
  });

  it('[TODO-04.1] wraps category filters when there are several conforme a Figma 4:973', () => {
    const styles = readAppStyles('pages/tasks/tasks.page.scss');
    expect(styles).toMatch(/\.chips\s*\{[^}]*display:\s*flex;/);
    expect(styles).toMatch(/\.chips\s*\{[^}]*gap:\s*var\(--app-space-8\);/);
    expect(styles).toMatch(/\.chips\s*\{[^}]*flex-wrap:\s*wrap;/);
  });

  it('[TODO-05.1] centers content inside the empty-state inset conforme a Figma 4:1062', () => {
    const styles = readAppStyles(
      'shared/components/empty-state/empty-state.component.scss',
    );
    expect(styles).toMatch(/padding-inline-end:\s*var\(--app-space-24\);/);
    expect(styles).toMatch(
      /max-width:\s*min\(100%, var\(--app-empty-copy-width\)\);/,
    );
    expect(styles).toMatch(/color:\s*var\(--app-on-primary\);/);
  });

  it('[TODO-05.1] keeps the clipboard ink visible on the light empty disc in dark mode conforme a Figma 4:1062', () => {
    const styles = readAppStyles(
      'shared/components/empty-state/empty-state.component.scss',
    );
    const variables = readFileSync(
      resolve(__dirname, 'variables.scss'),
      'utf8',
    );
    const dark = readFileSync(resolve(__dirname, '_dark.scss'), 'utf8');
    expect(styles).toMatch(
      /\.illustration\s*\{[^}]*color:\s*var\(--app-illustration-ink\);/,
    );
    expect(variables).toMatch(
      /--app-illustration-ink:\s*#\{t\.\$color-primary-dark\};/,
    );
    expect(dark).not.toMatch(/--app-illustration-ink/);
  });

  it('[TODO-05.1] centers the empty-state content conforme a Figma 4:1062', () => {
    const styles = readAppStyles(
      'shared/components/empty-state/empty-state.component.scss',
    );
    expect(styles).toMatch(/\.empty-state\s*\{[^}]*align-items:\s*center;/);
    expect(styles).toMatch(/\.empty-state\s*\{[^}]*text-align:\s*center;/);
  });
});
