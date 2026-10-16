export interface OperationStatus {
  busy: boolean;
  error: string | null;
}

export function createOperationRunner(
  report: (status: OperationStatus) => void,
) {
  let retryOperation: (() => Promise<void>) | undefined;

  async function run(operation: () => Promise<void>): Promise<void> {
    let operationError: string | null = null;
    report({ busy: true, error: null });
    try {
      await operation();
      retryOperation = undefined;
    } catch (error) {
      retryOperation = operation;
      operationError = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      report({ busy: false, error: operationError });
    }
  }

  return {
    run,
    async retry(): Promise<void> {
      if (retryOperation) {
        await run(retryOperation);
      }
    },
  };
}
