/**
 * Domain-level validation error. Signals that an input or entity invariant was
 * violated, so the API should map it to a client error (400) instead of a 500.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
