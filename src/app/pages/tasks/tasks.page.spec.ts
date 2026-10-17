import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TasksPage } from './tasks.page';
import { DebugTaskSeed } from './debug-task-seed';
import { configurePageTesting } from '../../testing/page.fixture';
import { taskFixture } from '../../testing/task.fixture';
import { CLOCK } from '../../core/di/tokens';
import { TASK_STATUS, TASK_STATUSES } from '../../domain/task';
import { TASK_EVENT } from '../../domain/task-state';
import en from '../../../assets/i18n/en.json';

describe('TasksPage', () => {
  async function setup(
    providers: Parameters<typeof configurePageTesting>[0] = {},
  ) {
    const dependencies = configurePageTesting({
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        ...(providers.providers ?? []),
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    const fixture = TestBed.createComponent(TasksPage);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    return { ...dependencies, fixture, page: fixture.componentInstance };
  }

  it('adds 5,000 debug tasks to five existing ones and activates bounded virtual rendering', async () => {
    const log = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    const { page, tasks, fixture } = await setup();
    await tasks.upsertMany(
      Array.from({ length: 5 }, (_, index) =>
        taskFixture({ id: `existing-${index}`, dueDate: '2026-01-03' }),
      ),
    );
    tasks.setStatuses([TASK_STATUS.COMPLETED]);
    tasks.setCategory('missing');
    await TestBed.inject(DebugTaskSeed).generateFiveThousand();
    fixture.detectChanges();
    expect(tasks.tasks()).toHaveLength(5005);
    expect(new Set(tasks.tasks().map((task) => task.id)).size).toBe(5005);
    expect(tasks.visibleTasks()).toHaveLength(5005);
    expect(page.shouldVirtualize()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item').length,
    ).toBeLessThan(200);
    expect(log).toHaveBeenCalledWith({
      name: 'DebugTaskSeed.generateFiveThousand',
      args: [],
    });
    expect(
      fixture.nativeElement.querySelector('[data-testid="generate-tasks"]'),
    ).toBeNull();
    log.mockRestore();
  });

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
    expect(fixture.nativeElement.textContent).toContain('No tasks for today');
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

  it('[TODO-01.2] shows the day title and today badge from the clock', async () => {
    const { fixture } = await setup({
      providers: [
        {
          provide: CLOCK,
          useValue: { now: () => 100, today: () => '2026-02-23' },
        },
      ],
    });
    expect(fixture.nativeElement.textContent).toContain('23.Mon');
    expect(
      fixture.nativeElement.querySelector('.today-badge').textContent,
    ).toContain('TODAY');
  });

  it('[TODO-02.1] floats the earlier-task panel at the Figma position', async () => {
    const { fixture, tasks } = await setup();
    await tasks.upsert(
      taskFixture({ title: 'Clean my flat', dueDate: '2026-01-01' }),
    );
    fixture.detectChanges();
    const panel: HTMLElement =
      fixture.nativeElement.querySelector('.pending-panel');
    expect(panel.style.left).toBe('62px');
    expect(panel.style.top).toBe('187px');
    expect(panel.style.width).toBe('300px');
    expect(
      panel.querySelector('.panel-header')?.getAttribute('style'),
    ).toContain('60px');
  });

  it('[TODO-02.2] collapses the panel to 62 and offsets the list', async () => {
    const { fixture, tasks } = await setup();
    await tasks.upsert(taskFixture({ dueDate: '2026-01-01' }));
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.panel-header') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const panel: HTMLElement =
      fixture.nativeElement.querySelector('.pending-panel');
    expect(panel.style.height).toBe('62px');
    expect(
      fixture.nativeElement.querySelector('.task-list').style.marginTop,
    ).toBe('83px');
  });

  it('[TODO-03.1] strikes through a completed task and checks its box', async () => {
    const { fixture, tasks } = await setup();
    await tasks.upsert(
      taskFixture({ title: 'Clean my flat', status: TASK_STATUS.COMPLETED }),
    );
    tasks.setStatuses([TASK_STATUS.COMPLETED]);
    fixture.detectChanges();
    const row: HTMLElement =
      fixture.nativeElement.querySelector('app-task-item');
    expect(row.querySelector('input')?.checked).toBe(true);
    expect(row.querySelector('.completed strong')?.textContent).toContain(
      'Clean my flat',
    );
  });

  it('[TODO-04.1] filters the list when a category chip is selected', async () => {
    const { fixture, tasks, categories } = await setup();
    await categories.upsert({
      id: 'shopping',
      name: 'Shopping',
      kind: 'shopping',
      icon: 'cart',
      colorToken: 'routine',
    });
    await tasks.upsertMany([
      taskFixture({
        id: 'groceries',
        title: 'Buy groceries',
        categoryId: 'shopping',
      }),
      taskFixture({ id: 'flat', title: 'Clean my flat', categoryId: null }),
    ]);
    fixture.detectChanges();
    const chips = [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ] as HTMLButtonElement[];
    chips.find((chip) => chip.textContent?.includes('Shopping'))?.click();
    fixture.detectChanges();
    expect(tasks.visibleTasks().map((task) => task.id)).toEqual(['groceries']);
    expect(
      chips.find((chip) => chip.textContent?.includes('Shopping'))?.classList,
    ).toContain('selected');
  });

  it('[TODO-05.1] shows the illustrated empty state and no embedded editor', async () => {
    const { fixture } = await setup();
    const illustration: HTMLElement =
      fixture.nativeElement.querySelector('.illustration');
    const action: HTMLElement = fixture.nativeElement.querySelector(
      '.empty-state button',
    );
    expect(illustration.style.width).toBe('68px');
    expect(action.style.width).toBe('239px');
    expect(action.style.height).toBe('50px');
    expect(fixture.nativeElement.querySelector('main .editor')).toBeNull();
  });

  it('[TODO-06.1] creates a task for today from the quick input', async () => {
    const { fixture, tasks } = await setup();
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'app-new-task-input input',
    );
    input.value = 'Clean my flat';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        'app-new-task-input button',
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(tasks.tasks()[0]).toMatchObject({
      title: 'Clean my flat',
      dueDate: '2026-01-02',
    });
  });

  it('[TODO-06.2] opens the form in a modal and keeps it off the page', async () => {
    const { fixture, page } = await setup();
    (
      fixture.nativeElement.querySelector('ion-fab-button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(page.sheetOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('main .editor')).toBeNull();
    expect(fixture.nativeElement.querySelector('ion-modal')).not.toBeNull();
  });
});
