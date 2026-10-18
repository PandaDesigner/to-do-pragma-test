import { readFileSync } from 'node:fs';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../assets/i18n/en.json';
import { TASK_EVENT } from '../../../domain/task-state';
import { taskFixture } from '../../../testing/task.fixture';
import { TaskItemComponent } from './task-item.component';
import { TaskItemCopyComponent } from './task-item-copy.component';
import { noteRowState, pendingRowState, taskRowState } from './task-item.state';

describe('TaskItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
  });

  it('renders the category dot when categoryIcon is provided', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture();
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    fixture.componentRef.setInput('categoryIcon', 'cart');
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.category-dot');
    expect(dot).not.toBeNull();
    expect(dot?.querySelector('ion-icon')).not.toBeNull();
    expect(dot?.getAttribute('title')).toBe('Shopping');
  });

  it('renders the dot without the icon when categoryIcon is not provided', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture();
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.category-dot');
    expect(dot).not.toBeNull();
    expect(dot?.querySelector('ion-icon')).toBeNull();
  });

  it('emits a toggle without changing the task and hides category dots when disabled', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = Object.freeze(taskFixture());
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('actions', [
      TASK_EVENT.COMPLETE,
      TASK_EVENT.ARCHIVE,
    ]);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    fixture.componentRef.setInput('categoryIcon', 'cart');
    const toggled = jest.fn();
    fixture.componentInstance.taskToggle.subscribe(toggled);
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    checkbox.dispatchEvent(new Event('change'));
    expect(toggled).toHaveBeenCalledWith(task.id);
    expect(task.status).toBe('pending');
    expect(fixture.nativeElement.querySelector('.category-dot')).not.toBeNull();
    fixture.componentRef.setInput('showCategories', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.category-dot')).toBeNull();
  });

  it('emits edit and State actions; archived tasks cannot toggle and the row has no delete button', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture({ status: 'archived' });
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('actions', [TASK_EVENT.RESTORE]);
    const action = jest.fn();
    const edit = jest.fn();
    const remove = jest.fn();
    fixture.componentInstance.action.subscribe(action);
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('button.danger')).toBeNull();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons).toHaveLength(2);
    buttons[0].click();
    buttons[1].click();
    expect(edit).toHaveBeenCalledWith(task);
    expect(action).toHaveBeenCalledWith({
      id: task.id,
      event: TASK_EVENT.RESTORE,
    });
    expect(remove).not.toHaveBeenCalled();
  });

  it('keeps task, note and pending rows on the same height and switches behavior by state', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', taskFixture({ title: 'Same size' }));
    fixture.componentRef.setInput('actions', [TASK_EVENT.COMPLETE]);
    fixture.componentRef.setInput('categoryName', 'Home');
    const heights = [taskRowState, noteRowState, pendingRowState].map(
      (state) => {
        fixture.componentRef.setInput('state', state);
        fixture.detectChanges();
        const row = fixture.nativeElement.querySelector(
          '.task-row',
        ) as HTMLElement;
        expect(row.getAttribute('data-kind')).toBe(state.kind);
        return getComputedStyle(row).height;
      },
    );
    expect(new Set(heights).size).toBe(1);
    const styles = readFileSync(
      'src/app/shared/components/task-item/task-item.component.scss',
      'utf8',
    );
    expect(styles).toContain('height: var(--app-task-row-height)');
    expect(styles).toContain('max-height: var(--app-task-row-height)');
    expect(styles).toMatch(/\.task-row\s*\{[^}]*width:\s*100%;/);
    expect(styles).toMatch(
      /app-task-item-actions\s*\{[^}]*margin-inline-start:\s*auto;/,
    );
    expect(styles).toMatch(/app-task-item-copy\s*\{[^}]*flex:\s*1\s*1\s*0;/);
    expect(styles).toMatch(/app-task-item-copy\s*\{[^}]*min-width:\s*0;/);
    expect(styles).toMatch(/app-task-item-copy\s*\{[^}]*overflow:\s*hidden;/);
    expect(styles).toMatch(
      /:host\.completed \.task-title__text\s*\{[^}]*text-decoration-line:\s*line-through;/,
    );
    expect(styles).toMatch(
      /\.task-title__text\s*\{[^}]*white-space:\s*nowrap;/,
    );
    expect(styles).toMatch(
      /\.task-title__text\s*\{[^}]*text-overflow:\s*ellipsis;/,
    );
    expect(styles).not.toContain('min-height: 65px');
    const longTitle = 'A'.repeat(180);
    for (const title of ['Hi', longTitle]) {
      fixture.componentRef.setInput('task', taskFixture({ title }));
      fixture.componentRef.setInput('state', taskRowState);
      fixture.detectChanges();
      const row = fixture.nativeElement.querySelector(
        '.task-row',
      ) as HTMLElement;
      const slide = fixture.nativeElement.querySelector(
        '.task-slide',
      ) as HTMLElement;
      expect(getComputedStyle(row).maxHeight).toBe(
        getComputedStyle(slide).maxHeight,
      );
    }
    fixture.componentRef.setInput('state', pendingRowState);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('ion-item-options')).toBeNull();
    fixture.componentRef.setInput('state', noteRowState);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.note-bullet')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.task-meta')).toBeNull();
  });

  it('keeps the copy column fixed and ends an overflow title with the last three letters', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', taskFixture({ title: 'Hi' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.task-title__end')).toBeNull();

    fixture.componentRef.setInput(
      'task',
      taskFixture({ title: `Buy milk at the market${'A'.repeat(80)}` }),
    );
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector(
      '.task-title__text',
    ) as HTMLElement;
    Object.defineProperty(text, 'scrollWidth', {
      configurable: true,
      value: 480,
    });
    Object.defineProperty(text, 'clientWidth', {
      configurable: true,
      value: 120,
    });
    const copy = fixture.debugElement.query(
      (node) => node.componentInstance instanceof TaskItemCopyComponent,
    ).componentInstance as TaskItemCopyComponent;
    copy.syncTitleOverflow();
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('.task-title__end')
        ?.textContent?.trim(),
    ).toBe(`...${'A'.repeat(3)}`);
    expect(fixture.nativeElement.textContent).not.toContain('more');

    fixture.componentRef.setInput(
      'task',
      taskFixture({ status: 'completed', title: 'Done task' }),
    );
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(
        'app-task-item-copy.completed .task-title__text',
      ),
    ).not.toBeNull();
  });

  it('[SWIPE-01.1] the end sliding option removes only when clicked and a note row stays a note', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture({ title: 'Cat tower' });
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('variant', 'note');
    const remove = jest.fn();
    fixture.componentInstance.remove.subscribe(remove);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('input')).toBeNull();
    expect(root.querySelector('.note-bullet')).not.toBeNull();
    expect(root.querySelector('ion-item-sliding')).not.toBeNull();
    expect(root.querySelector('ion-item-options')?.getAttribute('side')).toBe(
      'end',
    );
    expect(root.querySelector('.swipe-host')).toBeNull();
    expect(remove).not.toHaveBeenCalled();
    const option = root.querySelector('ion-item-option') as HTMLElement;
    option.click();
    expect(remove).toHaveBeenCalledWith(task.id);
  });

  it('[FIN-01.1] keeps the note row on the end sliding option conforme a Figma 4:440', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', taskFixture({ title: 'Cat tower' }));
    fixture.componentRef.setInput('variant', 'note');
    const remove = jest.fn();
    fixture.componentInstance.remove.subscribe(remove);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('ion-item-sliding')).not.toBeNull();
    expect(root.querySelector('ion-item-options')?.getAttribute('side')).toBe(
      'end',
    );
    expect(root.querySelector('input')).toBeNull();
    expect(root.querySelector('.note-bullet')).not.toBeNull();
    expect(remove).not.toHaveBeenCalled();
  });
});
