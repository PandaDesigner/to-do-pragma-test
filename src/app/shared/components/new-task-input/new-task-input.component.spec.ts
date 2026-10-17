import { TestBed } from '@angular/core/testing';
import { NewTaskInputComponent } from './new-task-input.component';

describe('NewTaskInputComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(NewTaskInputComponent);
    fixture.componentRef.setInput('label', 'Add task');
    fixture.detectChanges();
    return fixture;
  }

  it('ignores a blank title', () => {
    const fixture = setup();
    const submitted = jest.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentInstance.submitTitle();
    expect(submitted).not.toHaveBeenCalled();
  });

  it('rejects an input event that is not a text field', () => {
    const fixture = setup();
    expect(() =>
      fixture.componentInstance.updateDraft(new Event('input')),
    ).toThrow('El alta rápida no recibió un campo de texto');
  });
});
