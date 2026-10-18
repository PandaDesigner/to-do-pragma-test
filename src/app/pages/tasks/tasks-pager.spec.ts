import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('task list pager layout', () => {
  it('[TSK-20.1] keeps the last rows above the pager and the FAB conforme a Figma 4:520', () => {
    const tokens = readFileSync(
      resolve(__dirname, '../../../theme/_tokens.scss'),
      'utf8',
    );
    const page = readFileSync(resolve(__dirname, 'tasks.page.scss'), 'utf8');
    const compiled = compileString(`${tokens}\n${page}`, {
      loadPaths: [resolve(__dirname, '../../../theme'), __dirname],
    }).css;
    expect(compiled).toContain(
      'padding-bottom: calc(var(--app-pager-height) + var(--app-fab-size) + var(--app-space-16))',
    );
  });
});
