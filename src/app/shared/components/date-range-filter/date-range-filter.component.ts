import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonModal,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import type { TaskDateRange } from '../../../domain/task-strategy';

/**
 * Altura explicita del calendario. El overlay dimensiona a sus hijos y el
 * ion-datetime se colapsa a cero sin ella.
 */
export const DATE_FILTER_HEIGHT = 330;

export function startOfDay(isoDate: string): string {
  return `${isoDate}T00:00:00`;
}

/**
 * Convierte el valor de ion-datetime (ISO con hora) en el rango YYYY-MM-DD
 * que consume el store. Se recorta a la fecha porque el filtro trabaja a
 * resolucion de dia. Un rango con menos de dos dias no se aplica.
 */
export function toDateRange(
  value: readonly string[] | null | undefined,
): TaskDateRange | null {
  const dates = (value ?? [])
    .map((entry) => entry.slice(0, 10))
    .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry));
  const [from, to] = dates;
  if (!from || !to) {
    return null;
  }
  return from <= to ? { from, to } : { from: to, to: from };
}

/**
 * Selector de rango de fechas presentacional: recibe el dia actual y el rango
 * inicial, y emite el rango elegido. No importa store ni data; el filtro lo
 * aplica la pagina.
 */
@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.scss',
  imports: [IonModal, IonContent, IonDatetime, IonButton, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeFilterComponent {
  readonly isOpen = input(false);
  readonly today = input.required<string>();
  readonly initialRange = input<TaskDateRange | null>(null);
  readonly rangeChange = output<TaskDateRange | null>();
  readonly dismiss = output<void>();

  readonly height = DATE_FILTER_HEIGHT;
  readonly draft = signal<string[]>([]);

  onOpen(): void {
    const range = this.initialRange();
    this.draft.set(
      range
        ? [startOfDay(range.from), startOfDay(range.to)]
        : [startOfDay(this.today()), startOfDay(this.today())],
    );
  }

  select(value: readonly string[] | null | undefined): void {
    this.draft.set([...(value ?? [])]);
  }

  apply(): void {
    this.rangeChange.emit(toDateRange(this.draft()));
    this.close();
  }

  clear(): void {
    this.draft.set([]);
    this.rangeChange.emit(null);
    this.close();
  }

  close(): void {
    this.dismiss.emit();
  }
}