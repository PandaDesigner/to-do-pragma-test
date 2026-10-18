import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function read(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

describe('direct commits kept as they landed', () => {
  it('[SHEET-90.1] editor sheets open at 90 percent conforme a Figma 4:440', () => {
    const tasks = read('src/app/pages/tasks/tasks.page.html');
    const categories = read(
      'src/app/shared/components/category-sheet/category-sheet.component.html',
    );
    for (const template of [tasks, categories]) {
      expect(template).toContain('[initialBreakpoint]="0.9"');
      expect(template).toContain('[breakpoints]="[0, 0.5, 0.9]"');
      expect(template).toContain('handleBehavior="cycle"');
    }
  });

  it('[PAGE-20.1] the task list pages 20 rows and scrolls inside the well conforme a Figma 4:440', () => {
    expect(read('src/app/domain/pagination.ts')).toContain('PAGE_SIZE = 20');
    const template = read('src/app/pages/tasks/tasks.page.html');
    expect(template).toContain('ion-infinite-scroll');
    expect(template).toContain('(ionInfinite)="loadMore($event)"');
  });

  it('[SCROLL-01.1] the task well is 60vh and starts 20px under the filters conforme a Figma 4:440', () => {
    const styles = read('src/app/pages/tasks/tasks.page.scss');
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*flex:\s*0\s*1\s*60vh;/);
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*max-height:\s*60vh;/);
    expect(styles).toMatch(/\.task-scroll\s*\{[^}]*margin-top:\s*20px;/);
  });

  it('[PAGER-01.1] the numbered pager sits under the scroll well conforme a Figma 4:440', () => {
    const template = read('src/app/pages/tasks/tasks.page.html');
    expect(template).toMatch(
      /class="task-scroll"[\s\S]*<\/ion-content>\s*<\/div>\s*@if \(totalPages\(\) > 1\) \{\s*<nav class="pager"/,
    );
  });

  it('[ROW-01.1] a task row keeps one copy column, a sliding delete and a struck completed title conforme a Figma 4:440', () => {
    const template = read(
      'src/app/shared/components/task-item/task-item.component.html',
    );
    const styles = read(
      'src/app/shared/components/task-item/task-item.component.scss',
    );
    expect(template).toContain('<ion-item-options side="end">');
    expect(template).not.toContain('<ion-button');
    expect(styles).toMatch(/text-overflow:\s*ellipsis;/);
    expect(styles).toMatch(
      /:host\.completed \.task-title__text\s*\{[^}]*text-decoration-line:\s*line-through;/,
    );
  });

  it('[DEBUG-01.1] a development build still enables debug actions conforme a Figma 4:1496', () => {
    const development = read('src/environments/environment.ts');
    const service = read('src/app/core/config/remote-config.ts');
    expect(development).toMatch(/production:\s*false/);
    expect(service).toContain('if (!environment.production)');
  });
});
