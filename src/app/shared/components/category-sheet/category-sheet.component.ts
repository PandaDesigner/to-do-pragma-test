import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import {
  CATEGORY_SECTION,
  type Category,
  type CategorySection,
} from '../../../domain/category';
import { CategoryStore } from '../../../store/category';
import { ChipComponent } from '../chip/chip.component';

const CATEGORY_ICONS: readonly { key: string; label: string }[] = [
  { key: 'cart', label: 'Cart' },
  { key: 'home', label: 'Home' },
  { key: 'briefcase', label: 'Brief' },
  { key: 'heart', label: 'Heart' },
  { key: 'book', label: 'Book' },
  { key: 'plane', label: 'Plane' },
  { key: 'fork', label: 'Fork' },
  { key: 'muscle', label: 'Gym' },
  { key: 'music', label: 'Music' },
  { key: 'paw', label: 'Pet' },
  { key: 'money', label: 'Cash' },
  { key: 'star', label: 'Star' },
];

export type CategoryIconKey = (typeof CATEGORY_ICONS)[number]['key'];

const CATEGORY_COLORS = [
  { key: 'routine', token: 'routine' },
  { key: 'event', token: 'event' },
  { key: 'my', token: 'my' },
  { key: 'more', token: 'more' },
  { key: 'more-gray', token: 'more' },
  { key: 'primary', token: 'primary' },
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLORS)[number]['key'];

const SECTION_LABELS: readonly { key: CategorySection; label: string }[] = [
  { key: CATEGORY_SECTION.GENERAL, label: 'General' },
  { key: CATEGORY_SECTION.ROUTINE, label: 'Routine' },
  { key: CATEGORY_SECTION.EVENT, label: 'Event' },
];

@Component({
  selector: 'app-icon-option',
  standalone: true,
  template: `
    <button
      type="button"
      class="icon-option"
      [class.selected]="selected()"
      [attr.aria-pressed]="selected()"
      [attr.data-icon]="icon()"
      (click)="choose.emit()"
    >
      <span class="icon-option__glyph" aria-hidden="true">{{ glyph() }}</span>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .icon-option {
        box-sizing: border-box;
        width: var(--app-touch-target);
        height: var(--app-touch-target);
        border-radius: var(--app-radius-input);
        background: var(--app-surface-muted);
        border: 2px solid transparent;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
      }
      .icon-option.selected {
        border-color: var(--app-primary);
      }
      .icon-option__glyph {
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconOptionComponent {
  readonly icon = input.required<CategoryIconKey>();
  readonly selected = input(false);
  readonly glyph = input.required<string>();
  readonly choose = output<void>();
}

@Component({
  selector: 'app-color-swatch',
  standalone: true,
  template: `
    <button
      type="button"
      class="swatch"
      [class.selected]="selected()"
      [attr.data-color]="colorToken()"
      [attr.aria-pressed]="selected()"
      [attr.aria-label]="ariaLabel()"
      (click)="choose.emit()"
    >
      <span class="swatch__fill" [style.background]="fillColor()"></span>
      @if (selected()) {
      <span class="swatch__check" aria-hidden="true">OK</span>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .swatch {
        position: relative;
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: var(--app-radius-input);
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
      }
      .swatch__fill {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }
      .swatch.selected::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: var(--app-radius-input);
        border: 2px solid var(--app-primary);
      }
      .swatch__check {
        position: absolute;
        inset: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--app-on-primary);
        font-weight: 700;
        font-size: 12px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSwatchComponent {
  readonly colorToken = input.required<string>();
  readonly selected = input(false);
  readonly fillColor = input.required<string>();
  readonly ariaLabel = input.required<string>();
  readonly choose = output<void>();
}

const COLOR_FILL: Record<CategoryColorKey, string> = {
  routine: 'var(--app-category-2)',
  event: 'var(--app-category-3)',
  my: 'var(--app-category-4)',
  more: 'var(--app-category-5)',
  'more-gray': 'var(--app-category-5)',
  primary: 'var(--app-category-filler)',
};

@Component({
  selector: 'app-category-sheet',
  standalone: true,
  imports: [
    IonModal,
    IonContent,
    ChipComponent,
    IconOptionComponent,
    ColorSwatchComponent,
  ],
  templateUrl: './category-sheet.component.html',
  styleUrl: './category-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySheetComponent {
  private readonly store = inject(CategoryStore);
  readonly save = output<Category>();
  readonly delete = output<string>();
  readonly mode = computed(() => this.store.sheetRequest()?.mode ?? null);
  readonly isOpen = computed(() => this.store.sheetRequest() !== null);
  readonly icons = CATEGORY_ICONS;
  readonly colors = CATEGORY_COLORS;
  readonly sectionLabels = SECTION_LABELS;

  readonly name = signal('');
  readonly icon = signal<CategoryIconKey>('cart');
  readonly colorToken = signal<CategoryColorKey>('routine');
  readonly section = signal<CategorySection>(CATEGORY_SECTION.GENERAL);
  readonly editingId = signal<string | null>(null);

  readonly canSave = computed(() => this.name().trim().length > 0);
  readonly title = computed(() =>
    this.mode() === 'edit' ? 'Edit category' : 'New category',
  );

  constructor() {
    effect(() => this.syncFromRequest());
  }

  chooseIcon(key: CategoryIconKey): void {
    this.icon.set(key);
  }

  chooseColor(key: CategoryColorKey): void {
    this.colorToken.set(key);
  }

  chooseSection(key: CategorySection): void {
    this.section.set(key);
  }

  fillColor(key: CategoryColorKey): string {
    return COLOR_FILL[key];
  }

  onName(value: string): void {
    this.name.set(value);
  }

  dismiss(): void {
    this.store.closeCategorySheet();
    this.resetLocal();
  }

  submit(): void {
    if (!this.canSave()) {
      return;
    }
    const editingId = this.editingId();
    const existing = editingId
      ? this.store.categories().find((c) => c.id === editingId)
      : undefined;
    const draft: Category = {
      id: existing?.id ?? '',
      name: this.name().trim(),
      icon: this.icon(),
      colorToken: colorKeyToToken(this.colorToken()),
      kind: existing?.kind ?? 'list',
      section: this.section(),
    };
    if (!existing) {
      delete (draft as { id?: string }).id;
    }
    this.save.emit(draft);
    this.store.closeCategorySheet();
    this.resetLocal();
  }

  remove(): void {
    const editingId = this.editingId();
    if (!editingId) {
      return;
    }
    this.delete.emit(editingId);
    this.store.closeCategorySheet();
    this.resetLocal();
  }

  private resetLocal(): void {
    this.name.set('');
    this.icon.set('cart');
    this.colorToken.set('routine');
    this.section.set(CATEGORY_SECTION.GENERAL);
    this.editingId.set(null);
  }

  private syncFromRequest(): void {
    const request = this.store.sheetRequest();
    if (!request) {
      return;
    }
    this.editingId.set(request.mode === 'edit' ? request.draft.id : null);
    this.name.set(request.mode === 'edit' ? request.draft.name : '');
    this.icon.set(
      request.mode === 'edit'
        ? (request.draft.icon as CategoryIconKey)
        : 'cart',
    );
    this.colorToken.set(
      request.mode === 'edit'
        ? mapColorToken(request.draft.colorToken)
        : 'routine',
    );
    this.section.set(
      request.mode === 'edit'
        ? (request.draft.section ?? CATEGORY_SECTION.GENERAL)
        : CATEGORY_SECTION.GENERAL,
    );
  }
}

function mapColorToken(token: string): CategoryColorKey {
  if (token === 'primary' || token === 'todo' || token === 'filler') {
    return 'primary';
  }
  if (token === 'routine') {
    return 'routine';
  }
  if (token === 'event') {
    return 'event';
  }
  if (token === 'my') {
    return 'my';
  }
  return 'more';
}

function colorKeyToToken(key: CategoryColorKey): string {
  if (key === 'primary') {
    return 'primary';
  }
  return key;
}

export function fillColor(key: CategoryColorKey): string {
  return COLOR_FILL[key];
}