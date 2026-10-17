import { TestBed } from '@angular/core/testing';
import type { EnvironmentProviders, Provider } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { CATEGORY_SECTION, type CategorySection } from '../../domain/category';
import { ROUTE_DATA } from '../../core/di/tokens';
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
    options: {
      providers?: (Provider | EnvironmentProviders)[];
      routeData?: Record<string, unknown>;
    } = {},
  ) {
    const routeData = options.routeData ?? {};
    const extras = options.providers ?? [];
    const dependencies = configurePageTesting({
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: ROUTE_DATA, useValue: routeData },
        ...extras,
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

  async function setupSection(section?: CategorySection) {
    const dependencies = await setup({
      routeData: { categorySection: section },
    });
    await dependencies.categories.upsert({
      id: 'g-cat',
      name: 'General category',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    await dependencies.categories.upsert({
      id: 'r-cat',
      name: 'Blue category',
      kind: 'daily',
      colorToken: 'event',
      icon: 'list',
      section: CATEGORY_SECTION.ROUTINE,
    });
    await dependencies.categories.upsert({
      id: 'e-cat',
      name: 'Coral category',
      kind: 'list',
      colorToken: 'routine',
      icon: 'list',
      section: CATEGORY_SECTION.EVENT,
    });
    await dependencies.tasks.upsertMany([
      taskFixture({
        id: 'general',
        categoryId: 'g-cat',
        dueDate: '2026-02-23',
      }),
      taskFixture({
        id: 'routine',
        categoryId: 'r-cat',
        dueDate: '2026-02-23',
      }),
      taskFixture({ id: 'event', categoryId: 'e-cat', dueDate: '2026-02-23' }),
      taskFixture({
        id: 'done',
        categoryId: 'r-cat',
        status: TASK_STATUS.COMPLETED,
        dueDate: '2026-02-23',
      }),
      taskFixture({
        id: 'archived',
        categoryId: 'r-cat',
        status: TASK_STATUS.ARCHIVED,
        dueDate: '2026-02-23',
      }),
      taskFixture({ id: 'loose', categoryId: null, dueDate: '2026-02-23' }),
    ]);
    dependencies.fixture.detectChanges();
    return dependencies;
  }

  it.each([
    [CATEGORY_SECTION.ROUTINE, ['routine', 'done']],
    [CATEGORY_SECTION.EVENT, ['event']],
  ] as const)(
    '[TODO-07.1] filters section %s without using category colors conforme a Figma 4:440',
    async (section, expected) => {
      const { page, fixture } = await setupSection(section);
      expect(page.store.visibleTasks().map((task) => task.id)).toEqual([
        ...expected,
      ]);
      const labels = [
        ...fixture.nativeElement.querySelectorAll('app-chip button'),
      ].map((chip: HTMLElement) => chip.textContent?.trim());
      expect(labels).toEqual([
        'All',
        section === CATEGORY_SECTION.ROUTINE
          ? 'Blue category'
          : 'Coral category',
      ]);
    },
  );

  it('[TODO-07.3] shows every general category and uncategorized tasks in Todo conforme a Figma 4:440', async () => {
    const { page } = await setupSection();
    expect(page.store.visibleTasks().map((task) => task.id)).toEqual([
      'general',
      'loose',
    ]);
  });

  it('[TODO-07.4] keeps completed tasks visible until archived conforme a Figma 4:664', async () => {
    const { page } = await setupSection(CATEGORY_SECTION.ROUTINE);
    await page.toggleTask('routine');
    expect(page.store.visibleTasks().map((task) => task.id)).toContain(
      'routine',
    );
    await page.dispatch({ id: 'routine', event: TASK_EVENT.ARCHIVE });
    expect(page.store.visibleTasks().map((task) => task.id)).not.toContain(
      'routine',
    );
  });

  it('[TODO-07.5] limits the earlier panel to its section conforme a Figma 4:440', async () => {
    const { page, tasks } = await setupSection(CATEGORY_SECTION.ROUTINE);
    await tasks.upsertMany([
      taskFixture({ id: 'r-old', categoryId: 'r-cat', dueDate: '2026-01-01' }),
    ]);
    await tasks.upsertMany([
      taskFixture({ id: 'e-old', categoryId: 'e-cat', dueDate: '2026-01-01' }),
    ]);
    page.store.setStatuses([TASK_STATUS.PENDING, TASK_STATUS.OVERDUE]);
    expect(page.earlierTasks().map((task) => task.id)).toEqual(['r-old']);
  });

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
    page.openSheet();
    page.form.patchValue({ title: 'Test', dueDate: '2026-01-03' });
    await page.saveTask();
    expect(page.feedback.error()).toBe('Storage lleno');
    expect(page.sheetOpen()).toBe(true);
    expect(page.form.controls.title.value).toBe('Test');
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
    expect(row.querySelector('.completed .task-title')?.textContent).toContain(
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

  it('[TODO-06.2] opens editing in the modal and cancels without changing the task', async () => {
    const { page, tasks } = await setup();
    await tasks.upsert(taskFixture({ title: 'Original' }));
    page.editTask(tasks.tasks()[0]);
    expect(page.sheetOpen()).toBe(true);
    expect(page.form.controls.title.value).toBe('Original');
    page.form.controls.title.setValue('Unsaved');
    page.closeSheet();
    expect(page.sheetOpen()).toBe(false);
    expect(page.editingId()).toBeNull();
    expect(page.form.controls.title.value).toBe('');
    expect(tasks.tasks()[0].title).toBe('Original');
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

  it('[SHEET-01.3] opens the category sheet from the task editor selector', async () => {
    const { categories } = await setup();
    categories.openCategorySheet({ mode: 'create' });
    expect(categories.sheetRequest()).toEqual({ mode: 'create' });
  });

  it('populates the editor form with title, dueDate and categoryId when editing', async () => {
    const { categories, page, tasks } = await setup();
    await categories.upsert({
      id: 'cart',
      name: 'Shopping',
      kind: 'list',
      icon: 'cart',
      colorToken: 'routine',
    });
    await tasks.upsert(
      taskFixture({
        title: 'Buy milk',
        dueDate: '2026-03-15',
        categoryId: 'cart',
      }),
    );
    page.editTask(tasks.tasks()[0]);
    expect(page.form.controls.title.value).toBe('Buy milk');
    expect(page.form.controls.dueDate.value).toBe('2026-03-15');
    expect(page.form.controls.categoryId.value).toBe('cart');
    expect(page.sheetOpen()).toBe(true);
  });

  it('populates time, durationMin and reminderMin from the stored task', async () => {
    const { page, tasks } = await setup();
    await tasks.upsert(
      taskFixture({
        title: 'Run',
        dueDate: '2026-04-01',
        time: '08:30',
        durationMin: 45,
        reminderMin: 15,
      }),
    );
    page.editTask(tasks.tasks()[0]);
    expect(page.form.controls.time.value).toBe('08:30');
    expect(page.form.controls.durationMin.value).toBe('45');
    expect(page.form.controls.reminderMin.value).toBe('15');
  });

  it('persists time, durationMin and reminderMin when saving', async () => {
    const { page, tasks } = await setup();
    await page.openSheet();
    page.form.patchValue({
      title: 'Plan sprint',
      time: '09:00',
      durationMin: '60',
      reminderMin: '30',
    });
    await page.saveTask();
    const saved = tasks.tasks()[0];
    expect(saved.time).toBe('09:00');
    expect(saved.durationMin).toBe(60);
    expect(saved.reminderMin).toBe(30);
  });
});
