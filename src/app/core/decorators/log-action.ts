type ActionLogger = (entry: { name: string; args: unknown[] }) => void;

let logger: ActionLogger = (entry) => console.info(entry);

export function configureActionLogger(next: ActionLogger): void {
  logger = next;
}

export function LogAction(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  const actionName = `${target.constructor.name}.${propertyKey}`;
  return {
    ...descriptor,
    value: function (this: object, ...args: unknown[]): unknown {
      logger({ name: actionName, args });
      return original.apply(this, args);
    },
  };
}

export const logAction = LogAction;
