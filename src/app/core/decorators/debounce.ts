interface PendingCall {
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timer?: ReturnType<typeof setTimeout>;
}

function createPendingCall(): PendingCall {
  let resolve!: PendingCall['resolve'];
  let reject!: PendingCall['reject'];
  const promise = new Promise<unknown>((onSuccess, onFailure) => {
    resolve = onSuccess;
    reject = onFailure;
  });
  return { promise, resolve, reject };
}

export function Debounce(waitMs: number) {
  const pendingCalls = new WeakMap<object, PendingCall>();
  const executions = new WeakMap<object, Promise<unknown>>();

  return (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const original = descriptor.value as (...args: unknown[]) => unknown;
    return {
      ...descriptor,
      value: function (this: object, ...args: unknown[]): Promise<unknown> {
        const pending = pendingCalls.get(this) ?? createPendingCall();
        if (pending.timer !== undefined) {
          clearTimeout(pending.timer);
        }
        pendingCalls.set(this, pending);
        pending.timer = setTimeout(() => {
          pendingCalls.delete(this);
          const invoke = () => original.apply(this, args);
          const execution = Promise.resolve(executions.get(this)).then(
            invoke,
            invoke,
          );
          executions.set(this, execution);
          execution.then(pending.resolve, pending.reject);
        }, waitMs);
        return pending.promise;
      },
    };
  };
}

export const debounce = Debounce;
