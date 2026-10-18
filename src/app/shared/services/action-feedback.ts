import { Injectable, signal } from '@angular/core';

@Injectable()
export class ActionFeedback {
  private readonly errorState = signal<string | null>(null);
  readonly error = this.errorState.asReadonly();

  async run(operation: () => Promise<void>): Promise<void> {
    this.errorState.set(null);
    try {
      await operation();
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
