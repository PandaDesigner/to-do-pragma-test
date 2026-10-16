import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class DeletionConfirmation {
  private readonly alerts = inject(AlertController);

  async confirm(title: string): Promise<boolean> {
    const alert = await this.alerts.create({
      header: '¿Eliminar?',
      message: title,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'destructive';
  }
}
