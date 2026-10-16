import { TestBed } from '@angular/core/testing';
import { TasksPage } from './tasks.page';
import { configurePageTesting } from '../../testing/page.fixture';
import { taskFixture } from '../../testing/task.fixture';
import { TASK_STATUS, TASK_STATUSES } from '../../domain/task';
import { TASK_EVENT } from '../../domain/task-state';

describe('TasksPage', () => {
  async function setup() {
    const dependencies = configurePageTesting();
    const fixture = TestBed.createComponent(TasksPage);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    return { ...dependencies, fixture, page: fixture.componentInstance };
  }

  it('validates, creates, edits, completes, restores and deletes tasks', async () => {
    const { fixture, page, tasks, taskRepository, confirm } = await setup();
    await page.saveTask();
    expect(tasks.tasks()).toEqual([]);
    page.form.patchValue({ title: ' Comprar pan ', dueDate: '2026-01-03' });
    await page.saveTask();
    expect(tasks.tasks()[0]).toMatchObject({
      title: 'Comprar pan',
      categoryId: null,
      createdAt: 100,
    });
    const id = tasks.tasks()[0].id;
    page.editTask(tasks.tasks()[0]);
    page.form.controls.title.setValue('Pan y leche');
    await page.saveTask();
    expect(tasks.tasks()).toHaveLength(1);
    expect((await taskRepository.list())[0].title).toBe('Pan y leche');
    await page.toggleTask(id);
    expect(tasks.tasks()[0].status).toBe(TASK_STATUS.COMPLETED);
    await page.toggleTask(id);
    await page.dispatch({ id, event: TASK_EVENT.ARCHIVE });
    expect(tasks.tasks()[0].status).toBe(TASK_STATUS.ARCHIVED);
    await page.dispatch({ id, event: TASK_EVENT.RESTORE });
    confirm.mockResolvedValueOnce(false);
    await page.removeTask(id);
    expect(tasks.tasks()).toHaveLength(1);
    await page.removeTask(id);
    expect(await taskRepository.list()).toEqual([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay tareas');
  });

  it('switches from normal to bounded virtual rendering at exactly 200 and tracks IDs', async () => {
    const { page, tasks, fixture } = await setup();
    const taskList = Array.from({ length: 199 }, (_, index) =>
      taskFixture({ id: String(index), dueDate: '2026-01-03' }),
    );
    await tasks.upsertMany(taskList);
    fixture.detectChanges();
    expect(page.shouldVirtualize()).toBe(false);
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(199);
    expect(page.trackById(10, taskList[0])).toBe('0');
    await tasks.upsert(taskFixture({ id: '200', dueDate: '2026-01-03' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(page.shouldVirtualize()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item').length,
    ).toBeLessThan(200);
  });

  it('hides selectors/chips without dropping an assigned category on edit', async () => {
    const { page, fixture, enabled, tasks, categories } = await setup();
    await categories.upsert({
      id: 'c',
      name: 'Lista',
      kind: 'list',
      icon: 'list',
      colorToken: 'my',
    });
    await tasks.upsert(taskFixture({ categoryId: 'c', dueDate: '2026-01-03' }));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.category-chip'),
    ).not.toBeNull();
    enabled.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
    expect(fixture.nativeElement.querySelector('.category-chip')).toBeNull();
    page.editTask(tasks.tasks()[0]);
    await page.saveTask();
    expect(tasks.tasks()[0].categoryId).toBe('c');
  });

  it('shows persistence errors, retries, and reports missing tasks', async () => {
    const { page, taskRepository, tasks } = await setup();
    jest
      .spyOn(taskRepository, 'save')
      .mockRejectedValueOnce(new Error('Storage lleno'));
    page.form.patchValue({ title: 'Test', dueDate: '2026-01-03' });
    await page.saveTask();
    expect(page.feedback.error()).toBe('Storage lleno');
    expect(tasks.tasks()).toEqual([]);
    await page.retry();
    expect(tasks.tasks()).toHaveLength(1);
    tasks.setStatuses(TASK_STATUSES);
    await page.toggleTask('missing');
    expect(page.feedback.error()).toContain('Unknown task');
    await page.removeTask('missing');
    expect(page.feedback.error()).toContain('ya no existe');
    page.editingId.set('missing');
    await page.saveTask();
    expect(page.feedback.error()).toContain('ya no existe');
    page.cancelEdit();
    expect(page.editingId()).toBeNull();
  });
});
