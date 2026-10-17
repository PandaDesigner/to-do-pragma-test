import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  it.each(['todo', 'routine', 'event', 'my', 'more'])(
    '[TODO-04.1] renders category color %s conforme a Figma 4:973',
    (colorToken) => {
      const fixture = TestBed.createComponent(ChipComponent);
      fixture.componentRef.setInput('label', 'Categoría con nombre largo');
      fixture.componentRef.setInput('colorToken', colorToken);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.dot').dataset.color).toBe(
        colorToken,
      );
    },
  );

  it('[TODO-04.1] preserves selection and emits the category choice conforme a Figma 4:973', () => {
    const fixture = TestBed.createComponent(ChipComponent);
    fixture.componentRef.setInput('label', 'Shopping');
    fixture.componentRef.setInput('selected', true);
    const choose = jest.spyOn(fixture.componentInstance.choose, 'emit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-pressed')).toBe('true');
    button.click();
    expect(choose).toHaveBeenCalledTimes(1);
  });

  it('[SHEET-04.2] keeps the DOM unchanged when no icon is projected conforme a Figma 4:869', () => {
    const fixture = TestBed.createComponent(ChipComponent);
    fixture.componentRef.setInput('label', 'Shopping');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.querySelector('[appChipIcon]')).toBeNull();
    expect(button.querySelector('.dot')).not.toBeNull();
    expect(button.textContent?.trim()).toBe('Shopping');
  });

  it('[SHEET-04.2] renders the projected icon before the label conforme a Figma 4:869', () => {
    @Component({
      standalone: true,
      imports: [ChipComponent],
      template: `<app-chip label="Shopping"
        ><span appChipIcon>cart</span></app-chip
      >`,
    })
    class HostComponent {}
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[appChipIcon]',
    ) as HTMLElement;
    expect(icon?.textContent?.trim()).toBe('cart');
    expect(icon?.previousElementSibling).not.toBeNull();
  });
});
