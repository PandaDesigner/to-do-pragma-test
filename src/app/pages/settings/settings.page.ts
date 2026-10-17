import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { IonContent, IonToggle } from '@ionic/angular/standalone';
import { DebugTaskSeed } from '../tasks/debug-task-seed';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionFeedback } from '../../shared/services/action-feedback';
import {
  APP_LANGUAGE,
  parseAppLanguage,
} from '../../core/settings/app-language';
import {
  SettingsPreferences,
  SYSTEM_DARK,
} from '../../core/settings/settings-preferences';
import { THEME_PREFERENCE } from '../../../theme/theme-preference';
import { RemoteConfigService } from '../../core/config/remote-config';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  imports: [
    IonContent,
    IonToggle,
    TranslatePipe,
    PageHeaderComponent,
    ReactiveFormsModule,
  ],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  readonly preferences = inject(SettingsPreferences);
  readonly flags = inject(RemoteConfigService);
  private readonly seed = inject(DebugTaskSeed);
  private readonly feedback = inject(ActionFeedback);
  private readonly systemDark = inject(SYSTEM_DARK);
  readonly languages = APP_LANGUAGE;
  readonly languageControl = new FormControl(this.preferences.language(), {
    nonNullable: true,
  });
  readonly darkEnabled = (): boolean => {
    const theme = this.preferences.theme();
    if (theme === THEME_PREFERENCE.DARK) {
      return true;
    }
    if (theme === THEME_PREFERENCE.LIGHT) {
      return false;
    }
    return this.systemDark;
  };

  constructor() {
    effect(() => {
      this.languageControl.setValue(this.preferences.language(), {
        emitEvent: false,
      });
    });
  }

  async setDarkFromToggle(event: Event): Promise<void> {
    await this.setDark(readToggleChecked(event));
  }

  async setLanguageFromSelect(event: Event): Promise<void> {
    await this.setLanguage(readSelectValue(event));
  }

  async setDark(enabled: boolean): Promise<void> {
    if (enabled === this.darkEnabled()) {
      return;
    }
    await this.preferences.setTheme(
      enabled ? THEME_PREFERENCE.DARK : THEME_PREFERENCE.LIGHT,
    );
  }

  async setLanguage(language: string): Promise<void> {
    await this.preferences.setLanguage(parseAppLanguage(language));
  }

  async generateFiveThousand(): Promise<void> {
    await this.feedback.run(() => this.seed.generateFiveThousand());
  }
}

function readToggleChecked(event: Event): boolean {
  const detail = (event as CustomEvent<{ checked?: boolean }>).detail;
  if (typeof detail?.checked !== 'boolean') {
    throw new Error('Evento de modo oscuro inválido');
  }
  return detail.checked;
}

function readSelectValue(event: Event): string {
  if (!(event.target instanceof HTMLSelectElement)) {
    throw new Error('Evento de idioma inválido');
  }
  return event.target.value;
}
