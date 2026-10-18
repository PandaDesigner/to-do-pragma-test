import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { TASK_ITEM } from './task-item.state';

@Component({
  selector: 'app-task-item-actions',
  template: `
    <div class="task-actions">
      @if (item.presentation().showsEdit()) {
        <button
          type="button"
          [disabled]="item.disabled()"
          [attr.aria-label]="
            'task.edit' | translate: { title: item.task().title }
          "
          (click)="item.emitEdit(item.task())"
        >
          <ion-icon [icon]="item.icons.createOutline" aria-hidden="true" />
        </button>
      }
      @if (item.presentation().showsExtraActions()) {
        @for (event of item.extraActions(); track event) {
          <button
            type="button"
            [disabled]="item.disabled()"
            [attr.aria-label]="
              (item.labels[event] | translate) + ': ' + item.task().title
            "
            (click)="item.emitAction(event)"
          >
            <ion-icon [icon]="item.actionIcons[event]" aria-hidden="true" />
          </button>
        }
      }
    </div>
  `,
  styleUrl: './task-item.component.scss',
  imports: [IonIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemActionsComponent {
  readonly item = inject(TASK_ITEM);
}
