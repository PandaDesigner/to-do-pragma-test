import { TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';

describe('INIT-03 HomePage', () => {
  it('renders Todo Notebook without initializing Firebase', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('ion-title')?.textContent).toContain(
      'Todo Notebook',
    );
    expect(page.textContent).not.toContain('Ready to create an app?');
  });

  it('uses standalone OnPush change detection', () => {
    const definition = (
      HomePage as unknown as {
        ɵcmp: { standalone: boolean; onPush: boolean };
      }
    ).ɵcmp;
    expect(definition.standalone).toBe(true);
    expect(definition.onPush).toBe(true);
  });
});
