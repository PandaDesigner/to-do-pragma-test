type Timers = WeakMap<object, Map<string, ReturnType<typeof setTimeout>>>;

const timers: Timers = new WeakMap();

function getInstanceTimers(
  target: object,
): Map<string, ReturnType<typeof setTimeout>> {
  let instanceTimers = timers.get(target);
  if (!instanceTimers) {
    instanceTimers = new Map();
    timers.set(target, instanceTimers);
  }
  return instanceTimers;
}

export function debounce(waitMs: number) {
  return <Args extends unknown[]>(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const original = descriptor.value as (...args: Args) => unknown;
    const methodName = `${propertyKey}__debounced__`;

    return {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get(this: object) {
        return (...args: Args) => {
          const instanceTimers = getInstanceTimers(this);
          const previous = instanceTimers.get(propertyKey);
          if (previous !== undefined) {
            clearTimeout(previous);
          }
          const handle = setTimeout(() => {
            instanceTimers.delete(propertyKey);
            original.apply(this, args);
          }, waitMs);
          instanceTimers.set(propertyKey, handle);
        };
      },
      set(this: object, value: unknown) {
        Object.defineProperty(this, methodName, {
          value,
          configurable: true,
          enumerable: descriptor.enumerable,
          writable: true,
        });
      },
    };
  };
}
