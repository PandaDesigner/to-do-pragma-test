import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TASK_ITEM } from './task-item.state';

@Component({
  selector: 'app-task-item-leading',
  template: `
    @if (item.presentation().leading() === 'bullet') {
      <span class="note-bullet" aria-hidden="true"></span>
    } @else {
      <label class="task-check">
        <input
          type="checkbox"
          [checked]="item.task().status === 'completed'"
          [disabled]="item.disabled() || !item.canToggle()"
          [attr.aria-label]="
            'task.complete' | translate: { title: item.task().title }
          "
          [style.--app-category-tint]="item.resolvedCategoryColor()"
          (change)="item.emitToggle(item.task().id)"
        />
      </label>
    }
  `,
  styleUrl: './task-item.component.scss',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemLeadingComponent {
  readonly item = inject(TASK_ITEM);
}
