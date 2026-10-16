import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('INIT-03 AppComponent', () => {
  it('mounts the Ionic container and router outlet', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const application: HTMLElement = fixture.nativeElement;

    expect(application.querySelector('ion-app')).not.toBeNull();
    expect(application.querySelector('ion-router-outlet')).not.toBeNull();
  });

  it('redirects the initial route to a lazily loaded standalone page', async () => {
    expect(routes.find((route) => route.path === '')).toEqual({
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    });
    const homeRoute = routes.find((route) => route.path === 'home');
    expect(homeRoute?.loadComponent).toEqual(expect.any(Function));
    const loaded = await homeRoute?.loadComponent?.();
    expect(loaded).toBeDefined();
  });

  it('uses standalone OnPush change detection', () => {
    const definition = (
      AppComponent as unknown as {
        ɵcmp: { standalone: boolean; onPush: boolean };
      }
    ).ɵcmp;
    expect(definition.standalone).toBe(true);
    expect(definition.onPush).toBe(true);
  });
});
