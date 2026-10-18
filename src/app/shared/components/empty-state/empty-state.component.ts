import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { clipboardCheck } from '../../icons/app-icons';

export const EMPTY_ILLUSTRATION_SIZE = 68;
export const EMPTY_ACTION_WIDTH = 239;
export const EMPTY_ACTION_HEIGHT = 50;

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly hint = input('');
  readonly actionLabel = input('');
  readonly illustrated = input(false);
  readonly action = output<void>();
  readonly illustrationSize = EMPTY_ILLUSTRATION_SIZE;
  readonly actionWidth = EMPTY_ACTION_WIDTH;
  readonly actionHeight = EMPTY_ACTION_HEIGHT;
  readonly illustrationIcon = clipboardCheck;
}
