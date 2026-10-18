import { configureActionLogger, LogAction, logAction } from './log-action';

describe('@logAction', () => {
  afterEach(() => {
    configureActionLogger((entry) => console.info(entry));
    jest.restoreAllMocks();
  });

  it('logs to console by default and preserves thrown errors', () => {
    configureActionLogger((entry) => console.info(entry));
    const consoleSpy = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);
    const failure = new Error('invalid action');
    class Target {
      @LogAction
      fail(): never {
        throw failure;
      }
    }
    expect(() => new Target().fail()).toThrow(failure);
    expect(consoleSpy).toHaveBeenCalledWith({ name: 'Target.fail', args: [] });
  });
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
