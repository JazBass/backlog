import { describe, expect, it } from 'vitest'

import { createTaskSchema, getTaskByIdSchema } from './task.schema'

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

describe('createTaskSchema', () => {
  const minimalInput = { name: 'Write the schema', priority: 'medium' }

  it('accepts a minimal valid body', () => {
    expect(createTaskSchema.safeParse(minimalInput).success).toBe(true)
  })

  it('accepts a full valid body and transforms dueDate into a Date', () => {
    const result = createTaskSchema.safeParse({
      name: 'Ship the MVP',
      description: 'First version of the backlog app',
      priority: 'high',
      dueDate: '2026-11-01T10:00:00.000Z',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.dueDate).toBeInstanceOf(Date)
    }
  })

  it('trims the name', () => {
    const result = createTaskSchema.safeParse({ ...minimalInput, name: '  Write the schema  ' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Write the schema')
    }
  })

  it('accepts a name of exactly 25 characters', () => {
    expect(createTaskSchema.safeParse({ ...minimalInput, name: 'a'.repeat(25) }).success).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(createTaskSchema.safeParse({ priority: 'medium' }).success).toBe(false)
  })

  it('rejects an empty name', () => {
    expect(createTaskSchema.safeParse({ ...minimalInput, name: '' }).success).toBe(false)
  })

  it('rejects a whitespace-only name', () => {
    expect(createTaskSchema.safeParse({ ...minimalInput, name: '   ' }).success).toBe(false)
  })

  it('rejects a name longer than 25 characters', () => {
    const result = createTaskSchema.safeParse({ ...minimalInput, name: 'a'.repeat(26) })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toContain('name')
    }
  })

  it('rejects an invalid priority', () => {
    const result = createTaskSchema.safeParse({ ...minimalInput, priority: 'urgent' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toContain('priority')
    }
  })

  it('rejects a missing priority', () => {
    expect(createTaskSchema.safeParse({ name: 'Write the schema' }).success).toBe(false)
  })

  it('rejects a non-string description', () => {
    expect(createTaskSchema.safeParse({ ...minimalInput, description: 123 }).success).toBe(false)
  })

  it('rejects an invalid dueDate format', () => {
    const result = createTaskSchema.safeParse({ ...minimalInput, dueDate: 'tomorrow' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toContain('dueDate')
    }
  })
})

describe('getTaskByIdSchema', () => {
  it('accepts a valid UUID', () => {
    expect(getTaskByIdSchema.safeParse({ id: VALID_UUID }).success).toBe(true)
  })

  it('rejects a malformed UUID', () => {
    expect(getTaskByIdSchema.safeParse({ id: 'not-a-uuid' }).success).toBe(false)
  })

  it('rejects a missing id', () => {
    expect(getTaskByIdSchema.safeParse({}).success).toBe(false)
  })
})
