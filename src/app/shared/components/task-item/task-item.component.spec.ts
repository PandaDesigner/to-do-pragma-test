import { readFileSync } from 'node:fs';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../assets/i18n/en.json';
import { TASK_EVENT } from '../../../domain/task-state';
import { taskFixture } from '../../../testing/task.fixture';
import { TaskItemComponent } from './task-item.component';
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

  it('emits edit, delete and State actions; archived tasks cannot toggle', () => {
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
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[1].click();
    buttons[2].click();
    expect(edit).toHaveBeenCalledWith(task);
    expect(action).toHaveBeenCalledWith({
      id: task.id,
      event: TASK_EVENT.RESTORE,
    });
    expect(remove).toHaveBeenCalledWith(task.id);
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
    expect(styles).not.toContain('min-height: 65px');
    fixture.componentRef.setInput('state', pendingRowState);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('ion-item-options')).toBeNull();
    fixture.componentRef.setInput('state', noteRowState);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.note-bullet')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.task-meta')).toBeNull();
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
});
