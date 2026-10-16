import { Debounce, debounce } from './debounce';

describe('@Debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('coalesces calls and resolves every caller after the final invocation', async () => {
    const calls: number[] = [];
    class Target {
      @Debounce(30)
      async fire(value: number): Promise<number> {
        calls.push(value);
        return value * 2;
      }
    }
    const target = new Target();
    const promises = [target.fire(1), target.fire(2), target.fire(3)];
    expect(calls).toEqual([]);
    await jest.advanceTimersByTimeAsync(29);
    expect(calls).toEqual([]);
    await jest.advanceTimersByTimeAsync(1);
    expect(await Promise.all(promises)).toEqual([6, 6, 6]);
    expect(calls).toEqual([3]);
  });

  it('keeps instances independent and preserves the lowercase export', async () => {
    const calls: string[] = [];
    class Target {
      @debounce(20)
      async fire(value: string): Promise<void> {
        calls.push(value);
      }
    }
    const first = new Target();
    const second = new Target();
    const promises = [first.fire('a1'), second.fire('b1'), first.fire('a2')];
    await jest.advanceTimersByTimeAsync(20);
    await Promise.all(promises);
    expect(calls.sort()).toEqual(['a2', 'b1']);
  });

  it('rejects every caller on failure and allows a manual retry', async () => {
    const failure = new Error('disk full');
    const callback = jest
      .fn()
      .mockRejectedValueOnce(failure)
      .mockResolvedValue(undefined);
    class Target {
      @Debounce(20)
      async fire(): Promise<void> {
        await callback();
      }
    }
    const target = new Target();
    const first = expect(target.fire()).rejects.toBe(failure);
    const second = expect(target.fire()).rejects.toBe(failure);
    await jest.advanceTimersByTimeAsync(20);
    await Promise.all([first, second]);
    const retry = target.fire();
    await jest.advanceTimersByTimeAsync(20);
    await retry;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('serializes batches so an older write cannot finish after a newer one', async () => {
    let finishFirst!: () => void;
    const order: number[] = [];
    class Target {
      @Debounce(10)
      async fire(value: number): Promise<void> {
        if (value === 1) {
          await new Promise<void>((resolve) => {
            finishFirst = resolve;
          });
        }
        order.push(value);
      }
    }
    const target = new Target();
    const first = target.fire(1);
    await jest.advanceTimersByTimeAsync(10);
    const second = target.fire(2);
    await jest.advanceTimersByTimeAsync(10);
    expect(order).toEqual([]);
    finishFirst();
    await Promise.all([first, second]);
    expect(order).toEqual([1, 2]);
  });
});
