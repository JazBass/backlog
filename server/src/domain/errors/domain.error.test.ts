import { describe, expect, it } from 'vitest'

import { ValidationError } from './domain.error'

describe('ValidationError', () => {
  it('extends Error and keeps its identity', () => {
    const error = new ValidationError('Task name is required')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.name).toBe('ValidationError')
  })

  it('preserves the message', () => {
    const error = new ValidationError('Task dueDate must be in the future')

    expect(error.message).toBe('Task dueDate must be in the future')
  })
})
