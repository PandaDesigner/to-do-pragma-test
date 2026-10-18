import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class DeletionConfirmation {
  private readonly alerts = inject(AlertController);
  private readonly translate = inject(TranslateService);

  async confirm(title: string): Promise<boolean> {
    const alert = await this.alerts.create({
      header: this.translate.instant('task.deleteTitle'),
      message: this.translate.instant('task.deleteMessage', { title }),
      buttons: [
        { text: this.translate.instant('task.deleteCancel'), role: 'cancel' },
        {
          text: this.translate.instant('task.deleteConfirm'),
          role: 'destructive',
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'destructive';
  }
}
