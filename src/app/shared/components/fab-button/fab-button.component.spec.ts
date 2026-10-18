import { TestBed } from '@angular/core/testing';
import { add, createOutline } from 'ionicons/icons';
import { FabButtonComponent } from './fab-button.component';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type IconElement = HTMLElement & { icon?: string };

describe('FabButtonComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FabButtonComponent);
    fixture.componentRef.setInput('ariaLabel', 'Nueva tarea');
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      button: host.querySelector('ion-fab-button') as HTMLElement,
      icon: host.querySelector('ion-fab-button ion-icon') as IconElement,
    };
  }

  it('[FAB-01.1] renders the plus icon by default conforme a Figma 4:1109', () => {
    const { icon } = setup();
    expect(icon).not.toBeNull();
    expect(icon.icon).toBe(add);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('[FAB-01.1] accepts another imported ionicon', () => {
    const { icon } = setup({ icon: createOutline });
    expect(icon.icon).toBe(createOutline);
  });

  it('[FAB-01.2] exposes the accessible label on the button', async () => {
    const { fixture, button } = setup();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    // ion-fab-button hereda aria-label al <button> interno al hidratarse.
    const label =
      button.shadowRoot?.querySelector('button')?.getAttribute('aria-label') ??
      button.getAttribute('aria-label');
    expect(label).toBe('Nueva tarea');
  });

  it('[FAB-01.3] emits pressed on click', () => {
    const { fixture, button } = setup();
    const pressed = jest.spyOn(fixture.componentInstance.pressed, 'emit');
    button.click();
    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it('[FAB-01.3] does not emit when disabled', () => {
    const { fixture, button } = setup({ disabled: true });
    const pressed = jest.spyOn(fixture.componentInstance.pressed, 'emit');
    button.click();
    expect(pressed).not.toHaveBeenCalled();
  });

  it('[FAB-01.4] styles only with theme tokens conforme a Figma 4:1109', () => {
    const styles = readFileSync(
      resolve(__dirname, 'fab-button.component.scss'),
      'utf8',
    );
    expect(styles).toMatch(/width:\s*var\(--app-fab-size\);/);
    expect(styles).toMatch(/height:\s*var\(--app-fab-size\);/);
    expect(styles).toMatch(/--background:\s*var\(--app-primary\);/);
    expect(styles).toMatch(/--color:\s*var\(--app-on-primary\);/);
    expect(styles).toMatch(/--box-shadow:\s*var\(--app-shadow-fab\);/);
    expect(styles).toMatch(/width:\s*var\(--app-fab-icon-size\);/);
    expect(styles).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});
