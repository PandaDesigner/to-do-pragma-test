import { TestBed } from '@angular/core/testing';
import { TASK_EVENT } from '../../../domain/task-state';
import { taskFixture } from '../../../testing/task.fixture';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  it('renders the category icon next to the name when categoryIcon is provided', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture();
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    fixture.componentRef.setInput('categoryIcon', 'cart');
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('.category-chip');
    expect(chip?.querySelector('ion-icon')).not.toBeNull();
    expect(chip?.textContent).toContain('Shopping');
  });

  it('omits the icon when categoryIcon is not provided', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = taskFixture();
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('.category-chip');
    expect(chip?.querySelector('ion-icon')).toBeNull();
    expect(chip?.textContent).toContain('Shopping');
  });

  it('emits a toggle without changing the task and hides category chips when disabled', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = Object.freeze(taskFixture());
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('actions', [
      TASK_EVENT.COMPLETE,
      TASK_EVENT.ARCHIVE,
    ]);
    fixture.componentRef.setInput('categoryName', 'Shopping');
    const toggled = jest.fn();
    fixture.componentInstance.taskToggle.subscribe(toggled);
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    checkbox.dispatchEvent(new Event('change'));
    expect(toggled).toHaveBeenCalledWith(task.id);
    expect(task.status).toBe('pending');
    expect(
      fixture.nativeElement.querySelector('.category-chip').textContent,
    ).toContain('Shopping');
    fixture.componentRef.setInput('showCategories', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.category-chip')).toBeNull();
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
});
