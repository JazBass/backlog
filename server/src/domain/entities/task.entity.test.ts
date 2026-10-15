import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Task, type TaskPriority, type TaskProps, type TaskStatus } from './task.entity'

const NOW = new Date('2026-10-15T12:00:00.000Z')
const FUTURE = new Date('2026-11-01T00:00:00.000Z')
const PAST = new Date('2026-10-01T00:00:00.000Z')

function createTask(overrides: Partial<TaskProps> = {}): Task {
  return new Task({
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Write the task entity',
    priority: 'medium',
    ...overrides,
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Task', () => {
  describe('creation', () => {
    it('creates a task with all fields provided', () => {
      const task = new Task({
        id: '6fa459ea-ee8a-4ca4-894e-db77e160355e',
        name: 'Ship the MVP',
        description: 'Deliver the first version of the backlog app',
        priority: 'high',
        status: 'in_progress',
        createdAt: NOW,
        updatedAt: NOW,
        dueDate: FUTURE,
      })

      expect(task.id).toBe('6fa459ea-ee8a-4ca4-894e-db77e160355e')
      expect(task.name).toBe('Ship the MVP')
      expect(task.description).toBe('Deliver the first version of the backlog app')
      expect(task.priority).toBe('high')
      expect(task.status).toBe('in_progress')
      expect(task.createdAt.getTime()).toBe(NOW.getTime())
      expect(task.updatedAt.getTime()).toBe(NOW.getTime())
      expect(task.dueDate?.getTime()).toBe(FUTURE.getTime())
    })

    it('applies defaults when only id, name and priority are provided', () => {
      const task = createTask()

      expect(task.description).toBe('')
      expect(task.status).toBe('todo')
      expect(task.createdAt.getTime()).toBe(NOW.getTime())
      expect(task.updatedAt.getTime()).toBe(NOW.getTime())
      expect(task.dueDate).toBeUndefined()
    })

    it('rejects an empty name', () => {
      expect(() => createTask({ name: '' })).toThrow(/name is required/i)
    })

    it('rejects a whitespace-only name', () => {
      expect(() => createTask({ name: '   ' })).toThrow(/name is required/i)
    })

    it('rejects a name longer than 25 characters', () => {
      expect(() => createTask({ name: 'a'.repeat(26) })).toThrow(/25 characters/i)
    })

    it('rejects an invalid priority', () => {
      const invalidPriority = 'urgent' as unknown as TaskPriority
      expect(() => createTask({ priority: invalidPriority })).toThrow(/priority/i)
    })

    it('rejects an invalid status', () => {
      const invalidStatus = 'archived' as unknown as TaskStatus
      expect(() => createTask({ status: invalidStatus })).toThrow(/status/i)
    })

    it('rejects a dueDate in the past', () => {
      expect(() => createTask({ dueDate: PAST })).toThrow(/future/i)
    })

    it('rejects an invalid dueDate', () => {
      expect(() => createTask({ dueDate: new Date('not-a-date') })).toThrow(/valid date/i)
    })
  })

  describe('status transitions', () => {
    it('markInProgress sets status to in_progress and bumps updatedAt', () => {
      const task = createTask()

      vi.advanceTimersByTime(60_000)
      task.markInProgress()

      expect(task.status).toBe('in_progress')
      expect(task.updatedAt.getTime()).toBe(NOW.getTime() + 60_000)
    })

    it('markDone sets status to done and bumps updatedAt', () => {
      const task = createTask()

      vi.advanceTimersByTime(60_000)
      task.markDone()

      expect(task.status).toBe('done')
      expect(task.updatedAt.getTime()).toBe(NOW.getTime() + 60_000)
    })

    it('markTodo sets status back to todo and bumps updatedAt', () => {
      const task = createTask({ status: 'done' })

      vi.advanceTimersByTime(60_000)
      task.markTodo()

      expect(task.status).toBe('todo')
      expect(task.updatedAt.getTime()).toBe(NOW.getTime() + 60_000)
    })
  })

  describe('update', () => {
    it('applies a partial update and bumps updatedAt', () => {
      const task = createTask({ description: 'original' })

      vi.advanceTimersByTime(60_000)
      task.update({ name: 'Renamed task', priority: 'low', dueDate: FUTURE })

      expect(task.name).toBe('Renamed task')
      expect(task.description).toBe('original')
      expect(task.priority).toBe('low')
      expect(task.status).toBe('todo')
      expect(task.dueDate?.getTime()).toBe(FUTURE.getTime())
      expect(task.updatedAt.getTime()).toBe(NOW.getTime() + 60_000)
    })

    it('rejects an empty name and leaves the task unchanged', () => {
      const task = createTask()

      expect(() => task.update({ name: '' })).toThrow(/name is required/i)
      expect(task.name).toBe('Write the task entity')
      expect(task.updatedAt.getTime()).toBe(NOW.getTime())
    })

    it('rejects an invalid status', () => {
      const invalidStatus = 'archived' as unknown as TaskStatus
      const task = createTask()

      expect(() => task.update({ status: invalidStatus })).toThrow(/status/i)
    })

    it('rejects a dueDate in the past', () => {
      const task = createTask()

      expect(() => task.update({ dueDate: PAST })).toThrow(/future/i)
    })
  })

  describe('toJSON', () => {
    it('returns a serializable representation of the task', () => {
      const task = new Task({
        id: '6fa459ea-ee8a-4ca4-894e-db77e160355e',
        name: 'Ship the MVP',
        description: 'First version',
        priority: 'high',
        status: 'in_progress',
        createdAt: NOW,
        updatedAt: NOW,
        dueDate: FUTURE,
      })

      expect(task.toJSON()).toEqual({
        id: '6fa459ea-ee8a-4ca4-894e-db77e160355e',
        name: 'Ship the MVP',
        description: 'First version',
        priority: 'high',
        status: 'in_progress',
        createdAt: NOW.toISOString(),
        updatedAt: NOW.toISOString(),
        dueDate: FUTURE.toISOString(),
      })
    })

    it('is used by JSON.stringify and omits dueDate when not set', () => {
      const task = createTask()

      expect(task.toJSON().dueDate).toBeUndefined()
      expect(JSON.parse(JSON.stringify(task))).toEqual({
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Write the task entity',
        description: '',
        priority: 'medium',
        status: 'todo',
        createdAt: NOW.toISOString(),
        updatedAt: NOW.toISOString(),
      })
    })
  })
})
