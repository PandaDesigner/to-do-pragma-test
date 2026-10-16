import { debounce } from './debounce';

describe('@debounce', () => {
  it('coalesces rapid calls into a single invocation after the wait', async () => {
    const calls: number[] = [];
    class Target {
      @debounce(30)
      fire(value: number) {
        calls.push(value);
      }
    }
    const target = new Target();
    target.fire(1);
    target.fire(2);
    target.fire(3);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(calls).toEqual([3]);
  });

  it('keeps separate instances independent', async () => {
    const calls: string[] = [];
    class Target {
      @debounce(20)
      fire(value: string) {
        calls.push(value);
      }
    }
    const a = new Target();
    const b = new Target();
    a.fire('a1');
    b.fire('b1');
    a.fire('a2');
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(calls.sort()).toEqual(['a2', 'b1']);
  });
});
