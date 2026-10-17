import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { createOutline, trashOutline, listOutline } from 'ionicons/icons';
import { CREATE_ID } from '../../core/di/tokens';
import { RemoteConfigService } from '../../core/config/remote-config';
import {
  CATEGORY_KIND,
  CATEGORY_KINDS,
  CATEGORY_SECTION,
  CATEGORY_SECTIONS,
  getCategorySection,
  parseCategorySection,
  isCategoryKind,
  type Category,
} from '../../domain/category';
import { CategoryStore } from '../../store/category';
import { TaskStore } from '../../store/task';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ActionFeedback } from '../../shared/services/action-feedback';
import { DeletionConfirmation } from '../../shared/services/deletion-confirmation';

const VIRTUAL_SCROLL_THRESHOLD = 200;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  imports: [
    IonContent,
    IonIcon,
    PageHeaderComponent,
    EmptyStateComponent,
    ReactiveFormsModule,
    ScrollingModule,
    NgTemplateOutlet,
    TranslatePipe,
  ],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  readonly store = inject(CategoryStore);
  readonly tasks = inject(TaskStore);
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  private readonly createId = inject(CREATE_ID);
  private readonly confirmation = inject(DeletionConfirmation);
  readonly editingId = signal<string | null>(null);
  readonly kinds = CATEGORY_KINDS;
  readonly sections = CATEGORY_SECTIONS;
  readonly colors = ['my', 'event', 'todo', 'routine', 'more'];
  readonly icons = { createOutline, trashOutline, listOutline };
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    kind: new FormControl<string>(CATEGORY_KIND.LIST, { nonNullable: true }),
    colorToken: new FormControl('my', { nonNullable: true }),
    section: new FormControl<string>(CATEGORY_SECTION.GENERAL, {
      nonNullable: true,
    }),
  });
  readonly shouldVirtualize = computed(
    () => this.store.categories().length >= VIRTUAL_SCROLL_THRESHOLD,
  );
  readonly taskCounts = computed(() => {
    const counts = new Map<string | null, number>();
    for (const task of this.tasks.tasks()) {
      counts.set(task.categoryId, (counts.get(task.categoryId) ?? 0) + 1);
    }
    return counts;
  });
  readonly trackById = (_index: number, category: Category): string =>
    category.id;

  ngOnInit(): void {
    void this.feedback.run(async () => {
      await Promise.all([this.store.refresh(), this.tasks.refresh()]);
    });
  }

  async saveCategory(): Promise<void> {
    if (this.form.invalid || this.store.busy()) {
      this.form.markAllAsTouched();
      return;
    }
    await this.feedback.run(async () => {
      if (!this.flags.categoriesEnabled()) {
        throw new Error('Las categorías están deshabilitadas.');
      }
      const input = this.form.getRawValue();
      const section = parseCategorySection(input.section);
      if (
        !isCategoryKind(input.kind) ||
        !this.colors.includes(input.colorToken)
      ) {
        throw new Error('Tipo o color de categoría no válido.');
      }
      const existing = this.store
        .categories()
        .find((category) => category.id === this.editingId());
      if (this.editingId() && !existing) {
        throw new Error('La categoría ya no existe. Cancela la edición.');
      }
      await this.store.upsert({
        id: existing?.id ?? this.createId(),
        name: input.name.trim(),
        icon: existing?.icon ?? 'list',
        kind: input.kind,
        colorToken: input.colorToken,
        section,
      });
      this.cancelEdit();
    });
  }

  editCategory(category: Category): void {
    this.editingId.set(category.id);
    this.form.reset({
      name: category.name,
      kind: category.kind,
      colorToken: category.colorToken,
      section: getCategorySection(category),
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      kind: CATEGORY_KIND.LIST,
      colorToken: 'my',
      section: CATEGORY_SECTION.GENERAL,
    });
  }

  async removeCategory(category: Category): Promise<void> {
    await this.feedback.run(async () => {
      if (!this.flags.categoriesEnabled()) {
        throw new Error('Las categorías están deshabilitadas.');
      }
      if (
        await this.confirmation.confirm(
          category.name + ': sus tareas quedarán sin categoría.',
        )
      ) {
        await this.store.remove(category.id);
      }
    });
  }

  async retry(): Promise<void> {
    await this.feedback.run(() => this.store.retry());
  }
}
