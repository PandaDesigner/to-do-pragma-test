import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { add } from 'ionicons/icons';

/**
 * FAB del cuaderno (Figma 4:1109): círculo primary de 68 con icono de 24.
 * El icono se pasa como SVG importado de 'ionicons/icons' (Ionic standalone no
 * resuelve iconos por nombre sin addIcons). La posición se ajusta desde fuera
 * con --app-fab-inset-end y --app-fab-inset-bottom.
 */
@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.scss',
  imports: [IonFab, IonFabButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabButtonComponent {
  readonly icon = input<string>(add);
  readonly ariaLabel = input.required<string>();
  readonly disabled = input(false);
  readonly pressed = output<void>();

  press(): void {
    if (this.disabled()) {
      return;
    }
    this.pressed.emit();
  }
}
