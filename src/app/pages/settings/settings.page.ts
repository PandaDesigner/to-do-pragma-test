import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IonContent, IonToggle } from '@ionic/angular/standalone';
import {
  APP_LANGUAGE,
  parseAppLanguage,
} from '../../core/settings/app-language';
import {
  SettingsPreferences,
  SYSTEM_DARK,
} from '../../core/settings/settings-preferences';
import { THEME_PREFERENCE } from '../../../theme/theme-preference';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  imports: [IonContent, IonToggle, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  readonly preferences = inject(SettingsPreferences);
  private readonly systemDark = inject(SYSTEM_DARK);
  readonly languages = APP_LANGUAGE;
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
}
