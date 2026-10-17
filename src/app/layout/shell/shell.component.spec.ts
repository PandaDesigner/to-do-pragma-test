import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { APP_LANGUAGE } from '../../core/settings/app-language';
import { configurePageTesting } from '../../testing/page.fixture';
import { taskFixture } from '../../testing/task.fixture';
import { RemoteConfigService } from '../../core/config/remote-config';
import {
  APP_ROUTE,
  categoriesEnabledGuard,
} from '../../core/guards/categories-enabled-guard';
import { ShellComponent } from './shell.component';
import { routes } from '../../app.routes';

describe('Shell and categories guard', () => {
  function setup() {
    const dependencies = configurePageTesting({
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: APP_LANGUAGE.EN }),
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(APP_LANGUAGE.ES, { settings: { tab: 'Ajustes' } });
    translate.use(APP_LANGUAGE.ES);
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
    return { ...dependencies, fixture, router: TestBed.inject(Router) };
  }

  it('[TODO-01.1] shows the five-tab rail and enables Routine and Event', () => {
    const { fixture } = setup();
    const rail = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(rail).not.toBeNull();
    const labels = [...rail.querySelectorAll('[role="tab"]')].map(
      (tab: HTMLElement) => tab.textContent?.trim(),
    );
    expect(labels).toEqual(['Todo', 'Routine', 'Event', 'My', 'More']);
    expect(
      (rail.querySelector('[data-tab="routine"]') as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(
      (rail.querySelector('[data-tab="event"]') as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it.each([
    ['routine', '/tabs/routine'],
    ['event', '/tabs/event'],
  ])(
    '[TODO-07.1] navigates %s to its section route conforme a Figma 4:440',
    (tab, path) => {
      const { fixture, router } = setup();
      const navigate = jest
        .spyOn(router, 'navigateByUrl')
        .mockResolvedValue(true);
      (
        fixture.nativeElement.querySelector(
          '[data-tab="' + tab + '"]',
        ) as HTMLButtonElement
      ).click();
      expect(navigate).toHaveBeenCalledWith(path);
    },
  );

  it('[TODO-08.2] guards direct Routine/Event routes conforme a Figma 4:440', () => {
    const children = routes.find((route) => route.path === 'tabs')?.children;
    for (const path of ['routine', 'event']) {
      const route = children?.find((route) => route.path === path);
      expect(route?.data?.['categorySection']).toBe(path);
      expect(route?.canMatch).toContain(categoriesEnabledGuard);
    }
  });

  it.each(['/tabs/routine', '/tabs/event'])(
    '[TODO-08.1] redirects %s and disables section tabs when categories turn off conforme a Figma 4:440',
    async (path) => {
      const { fixture, enabled, router } = setup();
      jest.spyOn(router, 'url', 'get').mockReturnValue(path);
      const navigate = jest
        .spyOn(router, 'navigateByUrl')
        .mockResolvedValue(true);
      enabled.set(false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(navigate).toHaveBeenCalledWith(APP_ROUTE.TASKS);
      for (const tab of ['routine', 'event']) {
        expect(
          (
            fixture.nativeElement.querySelector(
              '[data-tab="' + tab + '"]',
            ) as HTMLButtonElement
          ).disabled,
        ).toBe(true);
      }
    },
  );

  it('renders both tabs, then hides categories and clears only the category filter', async () => {
    const { fixture, enabled, tasks } = setup();
    await tasks.upsertMany([
      taskFixture({ id: 'assigned', categoryId: 'c', dueDate: '2026-01-03' }),
      taskFixture({ id: 'unassigned', dueDate: '2026-01-03' }),
    ]);
    tasks.setCategory('c');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-tab="my"]'),
    ).not.toBeNull();
    expect(tasks.visibleTasks()).toHaveLength(1);
    enabled.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-tab="my"]')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-tab="todo"]'),
    ).not.toBeNull();
    expect(tasks.categoryId()).toBeUndefined();
    expect(tasks.visibleTasks()).toHaveLength(2);
    expect(tasks.tasks()[0].categoryId).toBe('c');
  });

  it('redirects an open categories route when a refreshed flag becomes false', async () => {
    const { fixture, enabled, router } = setup();
    jest.spyOn(router, 'url', 'get').mockReturnValue(APP_ROUTE.CATEGORIES);
    const navigate = jest
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);
    enabled.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(APP_ROUTE.TASKS);
  });

  it('shows remote errors and offers a manual retry', () => {
    const { fixture, remoteError } = setup();
    remoteError.set('Sin conexión');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="status"]').textContent,
    ).toContain('Sin conexión');
    (
      fixture.nativeElement.querySelector(
        '.remote-error button',
      ) as HTMLButtonElement
    ).click();
    expect(
      TestBed.inject(RemoteConfigService).initialize,
    ).toHaveBeenCalledTimes(1);
  });

  it('permits categories only while enabled and redirects direct navigation otherwise', () => {
    const { enabled, router } = setup();
    expect(TestBed.runInInjectionContext(categoriesEnabledGuard)).toBe(true);
    enabled.set(false);
    const denied = TestBed.runInInjectionContext(categoriesEnabledGuard);
    expect(denied).not.toBe(true);
    if (denied !== true) {
      expect(router.serializeUrl(denied)).toBe(APP_ROUTE.TASKS);
    }
  });
});
