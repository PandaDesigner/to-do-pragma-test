import { configureActionLogger, logAction } from './log-action';

describe('@logAction', () => {
  it('logs the action name and argument count', () => {
    const entries: { name: string; args: unknown[] }[] = [];
    configureActionLogger((entry) => {
      entries.push(entry);
    });
    class Checkout {
      @logAction
      pay(amount: number) {
        return amount * 2;
      }
    }
    const doubled = new Checkout().pay(10);
    expect(doubled).toBe(20);
    expect(entries).toEqual([{ name: 'Checkout.pay', args: [10] }]);
  });
});
