import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular/standalone';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../assets/i18n/en.json';
import { DeletionConfirmation } from './deletion-confirmation';

describe('DeletionConfirmation', () => {
  function setup(role: string | undefined) {
    const present = jest.fn().mockResolvedValue(undefined);
    const onDidDismiss = jest.fn().mockResolvedValue({ role });
    const alert = { present, onDidDismiss };
    const create = jest.fn().mockResolvedValue(alert);
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: AlertController, useValue: { create } },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    return {
      create,
      present,
      onDidDismiss,
      service: TestBed.inject(DeletionConfirmation),
    };
  }

  it('[SWIPE-01.2] creates a translated alert and does not use the title as the whole message', async () => {
    const { service, create } = setup('cancel');
    await service.confirm('Finish reports');
    expect(create).toHaveBeenCalledWith({
      header: 'Delete task?',
      message: '“Finish reports” will be permanently deleted.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' },
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
