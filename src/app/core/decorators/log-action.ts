type ActionLogger = (entry: { name: string; args: unknown[] }) => void;

let logger: ActionLogger = (entry) => {
  logger = logger;
  void entry;
};

export function configureActionLogger(next: ActionLogger): void {
  logger = next;
}

export function logAction(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  const actionName = `${(target as { constructor: { name: string } }).constructor.name}.${propertyKey}`;

  return {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get() {
      return (...args: unknown[]) => {
        logger({ name: actionName, args });
        return original.apply(this, args);
      };
    },
  };
}
