import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { EnvironmentProviders, Provider } from '@angular/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { By } from '@angular/platform-browser';
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
import { add } from 'ionicons/icons';
import { clipboardCheck } from '../../shared/icons/app-icons';

@Component({
  selector: 'app-routine-tab-host',
  imports: [TasksPage],
  template: '<app-tasks />',
  providers: [
    {
      provide: ROUTE_DATA,
      useValue: { categorySection: CATEGORY_SECTION.ROUTINE },
    },
  ],
})
class RoutineTabHostComponent {}

@Component({
  selector: 'app-event-tab-host',
  imports: [TasksPage],
  template: '<app-tasks />',
  providers: [
    {
      provide: ROUTE_DATA,
      useValue: { categorySection: CATEGORY_SECTION.EVENT },
    },
  ],
})
class EventTabHostComponent {}

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
        'Pending',
        section === CATEGORY_SECTION.ROUTINE
          ? 'Blue category'
          : 'Coral category',
      ]);
    },
  );

  it('[TODO-11.1] the pending chip narrows statuses and keeps the category chip conforme a Figma 4:973', async () => {
    const { fixture, page, tasks, categories } = await setup();
    await categories.upsert({
      id: 'home',
      name: 'Home',
      kind: 'list',
      icon: 'list',
      colorToken: 'my',
    });
    await tasks.upsertMany([
      taskFixture({
        id: 'open',
        title: 'Open',
        categoryId: 'home',
        status: TASK_STATUS.PENDING,
        dueDate: '2026-01-01',
      }),
      taskFixture({
        id: 'done',
        title: 'Done',
        categoryId: 'home',
        status: TASK_STATUS.COMPLETED,
        dueDate: '2026-01-02',
      }),
    ]);
    fixture.detectChanges();
    const chips = (): HTMLButtonElement[] => [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ];
    const pending = chips().find((chip) =>
      chip.textContent?.includes('Pending'),
    );
    expect(pending).toBeTruthy();
    expect(chips().some((chip) => chip.textContent?.includes('Home'))).toBe(
      true,
    );
    pending?.click();
    fixture.detectChanges();
    expect(page.visibleTasks().map((task) => task.id)).toEqual(['open']);
    expect(pending?.getAttribute('aria-pressed')).toBe('true');
    chips()
      .find((chip) => chip.textContent?.includes('Home'))
      ?.click();
    fixture.detectChanges();
    expect(page.visibleTasks().map((task) => task.id)).toEqual(['open']);
    chips()
      .find((chip) => chip.textContent?.includes('Pending'))
      ?.click();
    fixture.detectChanges();
    expect(page.visibleTasks().map((task) => task.id)).toEqual([
      'open',
      'done',
    ]);
  });

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

  it('[TODO-10.1] keeps assigned tasks in the list and only loose ones in the pending filter conforme a Figma 4:440', async () => {
    const { page, tasks, fixture } = await setup();
    await tasks.upsertMany([
      taskFixture({
        id: 'loose',
        title: 'Loose',
        categoryId: null,
        dueDate: '2026-01-01',
      }),
      taskFixture({
        id: 'assigned',
        title: 'Assigned',
        categoryId: 'home',
        dueDate: '2026-01-01',
      }),
    ]);
    fixture.detectChanges();
    expect(page.visibleTasks().map((task) => task.id)).toEqual([
      'loose',
      'assigned',
    ]);
    expect(page.earlierTasks().map((task) => task.id)).toEqual(['loose']);
  });

  it('[TODO-10.2] keeps the list on Routine and leaves the pending filter empty conforme a Figma 4:440', async () => {
    const { page, tasks, fixture } = await setup({
      routeData: { categorySection: CATEGORY_SECTION.ROUTINE },
    });
    await tasks.upsertMany([
      taskFixture({
        id: 'loose',
        categoryId: null,
        dueDate: '2026-01-01',
      }),
      taskFixture({
        id: 'assigned',
        categoryId: 'home',
        dueDate: '2026-01-01',
      }),
    ]);
    fixture.detectChanges();
    expect(page.visibleTasks().map((task) => task.id)).toEqual([
      'loose',
      'assigned',
    ]);
    expect(page.earlierTasks()).toEqual([]);
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

  it('[TODO-12.1] keeps a cached tab on its own section, chip and page conforme a Figma 4:520', async () => {
    const { tasks, categories } = await setup();
    await categories.upsert({
      id: 'r-cat',
      name: 'Blue category',
      kind: 'daily',
      colorToken: 'event',
      icon: 'list',
      section: CATEGORY_SECTION.ROUTINE,
    });
    await categories.upsert({
      id: 'e-cat',
      name: 'Coral category',
      kind: 'list',
      colorToken: 'routine',
      icon: 'list',
      section: CATEGORY_SECTION.EVENT,
    });
    await tasks.upsertMany([
      taskFixture({
        id: 'routine-a',
        title: 'Routine one',
        categoryId: 'r-cat',
        dueDate: '2026-02-01',
      }),
      taskFixture({
        id: 'routine-b',
        title: 'Routine two',
        categoryId: 'r-cat',
        dueDate: '2026-02-02',
      }),
      taskFixture({
        id: 'event-a',
        title: 'Event one',
        categoryId: 'e-cat',
        dueDate: '2026-02-03',
      }),
      taskFixture({
        id: 'event-b',
        title: 'Event two',
        categoryId: 'e-cat',
        dueDate: '2026-02-04',
      }),
    ]);
    tasks.setPageSize(1);

    const routine = TestBed.createComponent(RoutineTabHostComponent);
    const event = TestBed.createComponent(EventTabHostComponent);
    routine.detectChanges();
    event.detectChanges();
    await routine.whenStable();
    await event.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    routine.detectChanges();
    event.detectChanges();

    const routinePage = routine.debugElement.query(By.directive(TasksPage))
      .componentInstance as TasksPage;
    const eventPage = event.debugElement.query(By.directive(TasksPage))
      .componentInstance as TasksPage;
    const titles = (root: HTMLElement): string[] =>
      [...root.querySelectorAll('.task-title')].map(
        (node) => node.textContent?.trim() ?? '',
      );

    expect(titles(routine.nativeElement)).toEqual(['Routine one']);
    expect(titles(event.nativeElement)).toEqual(['Event one']);

    const coral = [
      ...event.nativeElement.querySelectorAll('app-chip button'),
    ].find((chip) =>
      chip.textContent?.includes('Coral category'),
    ) as HTMLButtonElement;
    coral.click();
    routine.detectChanges();
    event.detectChanges();
    expect(titles(routine.nativeElement)).toEqual(['Routine one']);
    const routineAll = [
      ...routine.nativeElement.querySelectorAll('app-chip button'),
    ].find((chip) => chip.textContent?.includes('All')) as HTMLButtonElement;
    expect(routineAll.getAttribute('aria-pressed')).toBe('true');

    eventPage.goToPage(2);
    routine.detectChanges();
    event.detectChanges();
    expect(routinePage.currentPage()).toBe(1);
    expect(eventPage.currentPage()).toBe(2);
    expect(titles(routine.nativeElement)).toEqual(['Routine one']);
    expect(titles(event.nativeElement)).toEqual(['Event two']);
  });

  it('[TSK-19.1] pages the filtered list and hides the pager when one page remains conforme a Figma 4:520', async () => {
    const { tasks, categories, fixture, page } = await setup();
    await categories.upsert({
      id: 'focus',
      name: 'Focus',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    await tasks.upsertMany([
      ...Array.from({ length: 45 }, (_, index) =>
        taskFixture({
          id: `general-${index}`,
          title: `General ${index}`,
          categoryId: null,
          dueDate: '2026-02-01',
        }),
      ),
      ...Array.from({ length: 5 }, (_, index) =>
        taskFixture({
          id: `focus-${index}`,
          title: `Focus ${index}`,
          categoryId: 'focus',
          dueDate: '2026-02-02',
        }),
      ),
    ]);
    const event = TestBed.createComponent(EventTabHostComponent);
    event.detectChanges();
    await event.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    event.detectChanges();

    const eventScroll = event.nativeElement.querySelector(
      'ion-infinite-scroll',
    ) as HTMLElement & { disabled?: boolean };
    const scroll = fixture.nativeElement.querySelector(
      'ion-infinite-scroll',
    ) as HTMLElement & { disabled?: boolean };
    expect(eventScroll.disabled).toBe(true);
    expect(page.totalPages()).toBe(3);
    expect(scroll.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('.pager')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(20);

    const complete = jest.fn();
    page.loadMore({ target: { complete } } as never);
    fixture.detectChanges();
    expect(complete).toHaveBeenCalled();
    expect(page.currentPage()).toBe(2);
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(20);
    expect(
      fixture.nativeElement.querySelector('.task-title')?.textContent?.trim(),
    ).toBe('General 20');
    page.loadMore({ target: { complete: jest.fn() } } as never);
    fixture.detectChanges();
    expect(page.currentPage()).toBe(3);
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(10);
    expect(scroll.disabled).toBe(true);

    const focus = [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ].find((chip) => chip.textContent?.includes('Focus')) as HTMLButtonElement;
    focus.click();
    fixture.detectChanges();
    expect(page.currentPage()).toBe(1);
    expect(scroll.disabled).toBe(true);
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(5);
    expect(fixture.nativeElement.querySelector('.pager')).toBeNull();
  });

  it('[APP-09.1] adds 5,000 debug tasks to five existing ones and pages them 20 at a time without virtual scroll', async () => {
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
    expect(tasks.visibleTasks()).toHaveLength(20);
    expect(page.totalPages()).toBe(251);
    expect(page.visibleTasks()).toHaveLength(20);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport'),
    ).toBeNull();
    expect(fixture.nativeElement.querySelector('.task-list')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.pager')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('app-task-item'),
    ).toHaveLength(20);
    const scroll = fixture.nativeElement.querySelector(
      'ion-infinite-scroll',
    ) as HTMLElement & { disabled?: boolean };
    expect(scroll.disabled).toBe(false);
    page.loadMore({ target: { complete: jest.fn() } } as never);
    fixture.detectChanges();
    expect(page.currentPage()).toBe(2);
    expect(page.visibleTasks()).toHaveLength(20);
    expect(
      fixture.nativeElement
        .querySelector('.pager__btn--active')
        ?.textContent?.trim(),
    ).toBe('2');
    expect(fixture.nativeElement.querySelectorAll('.pager__btn')).toHaveLength(
      5,
    );
    expect(fixture.nativeElement.querySelector('.pager__ellipsis')).toBeNull();
    expect(tasks.hasMoreTasks()).toBe(true);
    expect(log).toHaveBeenCalledWith({
      name: 'DebugTaskSeed.generateFiveThousand',
      args: [],
    });
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
    expect(fixture.nativeElement.querySelector('.category-dot')).not.toBeNull();
    enabled.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
    expect(fixture.nativeElement.querySelector('.category-dot')).toBeNull();
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

  it('[TODO-04.2] shows notes and hides the pending panel for a shopping category', async () => {
    const { fixture, tasks, categories } = await setup();
    await categories.upsert({
      id: 'shopping',
      name: 'Shopping',
      kind: 'shopping',
      icon: 'cart',
      colorToken: 'routine',
    });
    await tasks.upsert(
      taskFixture({
        id: 'groceries',
        title: 'Buy groceries',
        categoryId: 'shopping',
        dueDate: '2026-01-01',
      }),
    );
    fixture.detectChanges();
    const chips = [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ] as HTMLButtonElement[];
    chips.find((chip) => chip.textContent?.includes('Shopping'))?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('My notes');
    expect(fixture.nativeElement.querySelector('.pending-panel')).toBeNull();
    expect(fixture.nativeElement.querySelector('.note-bullet')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('app-task-item input'),
    ).toBeNull();
  });

  it('[TODO-01.3] TODAY clears the category filter and reopens the pending panel', async () => {
    const { fixture, page, tasks, categories } = await setup();
    await categories.upsert({
      id: 'shopping',
      name: 'Shopping',
      kind: 'shopping',
      icon: 'cart',
      colorToken: 'routine',
    });
    await tasks.upsert(
      taskFixture({
        id: 'groceries',
        title: 'Buy groceries',
        categoryId: 'shopping',
        dueDate: '2026-01-01',
      }),
    );
    fixture.detectChanges();
    const chips = [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ] as HTMLButtonElement[];
    chips.find((chip) => chip.textContent?.includes('Shopping'))?.click();
    page.panelOpen.set(false);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.today-badge') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(tasks.categoryId()).toBeUndefined();
    expect(page.panelOpen()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.pending-panel'),
    ).not.toBeNull();
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

  it('[TODO-06.1] renders the shared FAB with the plus icon', async () => {
    const { fixture } = await setup();
    const icon = fixture.nativeElement.querySelector(
      'app-fab-button ion-fab-button ion-icon',
    ) as HTMLElement & { icon?: string };
    expect(icon).not.toBeNull();
    expect(icon.icon).toBe(add);
  });

  it('[TODO-05.1] renders the clipboard icon inside the empty-state illustration', async () => {
    const { fixture } = await setup();
    const icon = fixture.nativeElement.querySelector(
      '.empty-state .illustration ion-icon',
    ) as (HTMLElement & { icon?: string }) | null;
    expect(icon).not.toBeNull();
    expect(icon?.icon).toBe(clipboardCheck);
  });

  it('[TODO-06.1] creates a task for today from the new-task sheet opened via the FAB', async () => {
    const { fixture, page, tasks } = await setup();
    (
      fixture.nativeElement.querySelector('ion-fab-button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(page.sheetOpen()).toBe(true);
    page.form.patchValue({ title: 'Clean my flat' });
    await page.saveTask();
    fixture.detectChanges();
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
      durationPreset: 'custom',
      durationMin: '60',
      reminderMin: '30',
    });
    await page.saveTask();
    const saved = tasks.tasks()[0];
    expect(saved.time).toBe('09:00');
    expect(saved.durationMin).toBe(60);
    expect(saved.reminderMin).toBe(30);
  });

  it('[TODAY-UI-01.1] paints the chevron as a registered ion-icon beside the label', async () => {
    const { fixture, page } = await setup();
    const badge = fixture.nativeElement.querySelector(
      '.today-badge',
    ) as HTMLElement;
    const icon = badge.querySelector('ion-icon');
    expect(icon).not.toBeNull();
    // El icono se pasa por [icon] con el SVG importado, no por name. Un
    // atributo name sin addIcons deja el nodo en el DOM pero no dibuja nada,
    // así que comprobar el atributo daba verde con la pantalla rota.
    expect(icon?.hasAttribute('name')).toBe(false);
    expect(page.icons.chevronForward).toBeDefined();
    expect((icon as { icon?: unknown }).icon).toBe(page.icons.chevronForward);
    // El icono debe ser hermano del texto, no parte de la cadena traducible,
    // para que el gap del flex separe ambos nodos.
    expect(icon?.parentElement).toBe(badge);
    expect(badge.textContent).not.toContain('›');
    expect(badge.textContent?.trim()).toBe('TODAY');
  });

  it('[TODAY-UI-01.3] keeps the Figma box of 63x21 as a minimum instead of a fixed width', async () => {
    const scss = readFileSync(join(__dirname, 'tasks.page.scss'), 'utf8');
    const rule = scss.slice(
      scss.indexOf('.today-badge {'),
      scss.indexOf('}', scss.indexOf('.today-badge {')),
    );
    // Las medidas viven en tokens: el badge no puede fijarlas a 63 px.
    expect(rule).toContain('min-width: var(--app-day-badge-min-width)');
    expect(rule).not.toMatch(/(^|\s)width:\s*63px/);
    expect(rule).toContain('height: var(--app-day-badge-height)');
    expect(rule).not.toMatch(/(^|\s)height:\s*21px/);

    // Los tokens apuntan a la caja medida en Figma 4:440: w=63 h=21.
    const tokens = readFileSync(
      join(__dirname, '../../../theme/_tokens.scss'),
      'utf8',
    );
    expect(tokens).toMatch(/\$day-badge-min-width:\s*63px/);
    expect(tokens).toMatch(/\$day-badge-height:\s*21px/);
  });

  it('[TODAY-UI-01.4] still resets the view after the chevron became an icon', async () => {
    const { fixture, page, tasks, categories } = await setup();
    await categories.upsert({
      id: 'shopping',
      name: 'Shopping',
      kind: 'shopping',
      icon: 'cart',
      colorToken: 'routine',
    });
    await tasks.upsert(
      taskFixture({
        id: 'groceries',
        title: 'Buy groceries',
        categoryId: 'shopping',
        dueDate: '2026-01-01',
      }),
    );
    fixture.detectChanges();
    const chips = [
      ...fixture.nativeElement.querySelectorAll('app-chip button'),
    ] as HTMLButtonElement[];
    chips.find((chip) => chip.textContent?.includes('Shopping'))?.click();
    page.panelOpen.set(false);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.today-badge') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(tasks.categoryId()).toBeUndefined();
    expect(page.panelOpen()).toBe(true);
  });
});
