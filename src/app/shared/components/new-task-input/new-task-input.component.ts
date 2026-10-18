import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-new-task-input',
  templateUrl: './new-task-input.component.html',
  styleUrl: './new-task-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskInputComponent {
  readonly label = input.required<string>();
  readonly submitted = output<string>();
  readonly draft = signal('');

  updateDraft(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('El alta rápida no recibió un campo de texto');
    }
    this.draft.set(event.target.value);
  }

  submitTitle(): void {
    const title = this.draft().trim();
    if (!title) {
      return;
    }
    this.submitted.emit(title);
    this.draft.set('');
  }
}
