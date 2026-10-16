import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular/standalone';
import { DeletionConfirmation } from './deletion-confirmation';

describe('DeletionConfirmation', () => {
  function setup(role: string | undefined) {
    const present = jest.fn().mockResolvedValue(undefined);
    const onDidDismiss = jest.fn().mockResolvedValue({ role });
    const alert = { present, onDidDismiss };
    const create = jest.fn().mockResolvedValue(alert);
    TestBed.configureTestingModule({
      providers: [{ provide: AlertController, useValue: { create } }],
    });
    return {
      create,
      present,
      onDidDismiss,
      service: TestBed.inject(DeletionConfirmation),
    };
  }

  it('creates the alert with the destructive and cancel buttons and the title as message', async () => {
    const { service, create } = setup('cancel');
    await service.confirm('Tarea X');
    expect(create).toHaveBeenCalledWith({
      header: '¿Eliminar?',
      message: 'Tarea X',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
  });

  it('presents the alert before awaiting dismissal', async () => {
    const { service, present } = setup('cancel');
    await service.confirm('Tarea X');
    expect(present).toHaveBeenCalledTimes(1);
  });

  it('returns true when the user taps the destructive button', async () => {
    const { service } = setup('destructive');
    expect(await service.confirm('Tarea X')).toBe(true);
  });

  it('returns false when the user taps cancel', async () => {
    const { service } = setup('cancel');
    expect(await service.confirm('Tarea X')).toBe(false);
  });

  it('returns false when the alert is dismissed by the backdrop', async () => {
    const { service } = setup(undefined);
    expect(await service.confirm('Tarea X')).toBe(false);
  });
});
