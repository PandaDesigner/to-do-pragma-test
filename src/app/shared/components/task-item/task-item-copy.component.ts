import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TASK_ITEM } from './task-item.state';

@Component({
  selector: 'app-task-item-copy',
  template: `
    <div class="task-copy">
      <strong class="task-title" [attr.title]="item.task().title">{{
        item.task().title
      }}</strong>
      @if (item.presentation().showsMeta()) {
        <div class="task-meta" [attr.title]="item.metaTitle()">
          <span class="task-due">
            <span class="task-due__date">{{ item.task().dueDate }}</span>
            @if (item.task().time) {
              <span class="task-due__time">{{ item.task().time }}</span>
            }
          </span>
          @if (item.showCategories() && item.categoryName()) {
            <span
              class="category-dot"
              [style.--app-category-tint]="item.resolvedCategoryColor()"
              [attr.title]="item.categoryName()"
              [attr.aria-label]="item.categoryName()"
            >
              @if (item.resolvedCategoryIcon(); as icon) {
                <ion-icon
                  class="category-dot__icon"
                  [icon]="icon"
                  aria-hidden="true"
                ></ion-icon>
              }
            </span>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './task-item.component.scss',
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemCopyComponent {
  readonly item = inject(TASK_ITEM);
}
