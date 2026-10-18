import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TASK_ITEM } from './task-item.state';

export function taskTitleTail(title: string): string {
  const word = title.trim().split(/\s+/).filter(Boolean).at(-1) ?? '';
  return `...${word.slice(-3)}`;
}

@Component({
  selector: 'app-task-item-copy',
  template: `
    <div class="task-copy">
      <strong
        class="task-title"
        [class.task-title--overflow]="titleOverflow()"
        [attr.title]="item.task().title"
      >
        <span #titleText class="task-title__text">{{ item.task().title }}</span>
        @if (titleOverflow()) {
          <span class="task-title__end">{{ titleTail() }}</span>
        }
      </strong>
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
  host: {
    '[class.completed]': 'item.task().status === "completed"',
  },
})
export class TaskItemCopyComponent {
  readonly item = inject(TASK_ITEM);
  readonly titleOverflow = signal(false);
  private readonly titleText = viewChild<ElementRef<HTMLElement>>('titleText');

  constructor() {
    afterNextRender(() => this.syncTitleOverflow());
    effect(() => {
      this.item.task().title;
      queueMicrotask(() => this.syncTitleOverflow());
    });
  }

  titleTail(): string {
    return taskTitleTail(this.item.task().title);
  }

  syncTitleOverflow(): void {
    const element = this.titleText()?.nativeElement;
    this.titleOverflow.set(
      !!element && element.scrollWidth > element.clientWidth,
    );
  }
}
