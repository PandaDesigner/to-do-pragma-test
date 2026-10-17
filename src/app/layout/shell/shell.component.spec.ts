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

  it('renders both tabs, then hides categories and clears only the category filter', async () => {
    const { fixture, enabled, tasks } = setup();
    await tasks.upsertMany([
      taskFixture({ id: 'assigned', categoryId: 'c', dueDate: '2026-01-03' }),
      taskFixture({ id: 'unassigned', dueDate: '2026-01-03' }),
    ]);
    tasks.setCategory('c');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('ion-tab-button[tab="my"]'),
    ).not.toBeNull();
    expect(tasks.visibleTasks()).toHaveLength(1);
    enabled.set(false);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('ion-tab-button[tab="my"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('ion-tab-button[tab="tasks"]'),
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
