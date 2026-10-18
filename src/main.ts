import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { inject, provideAppInitializer } from '@angular/core';
import { RemoteConfigService } from './app/core/config/remote-config';
import { FirebaseRemoteConfigPort } from './app/core/config/firebase-remote-config-port';
import { REMOTE_CONFIG_PORT } from './app/core/di/tokens';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { APP_LANGUAGE } from './app/core/settings/app-language';
import { provideLocalRepositories } from './app/core/di/storage-initializer';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: APP_LANGUAGE.EN,
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideLocalRepositories(),
    { provide: REMOTE_CONFIG_PORT, useExisting: FirebaseRemoteConfigPort },
    provideAppInitializer(() => inject(RemoteConfigService).initialize()),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
  ],
});
