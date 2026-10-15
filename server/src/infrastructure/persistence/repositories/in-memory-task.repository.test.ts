import { beforeEach, describe, expect, it } from 'vitest'

import { Task, type TaskProps } from '../../../domain/entities/task.entity'
import { InMemoryTaskRepository } from './in-memory-task.repository'

const FIRST_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const SECOND_ID = '6fa459ea-ee8a-4ca4-894e-db77e160355e'

function createTask(overrides: Partial<TaskProps> = {}): Task {
  return new Task({
    id: FIRST_ID,
    name: 'Write the repository',
    priority: 'medium',
    ...overrides,
  })
}

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
  })

  describe('save', () => {
    it('saves a new task and returns it', () => {
      const task = createTask()

      expect(repository.save(task)).toBe(task)
      expect(repository.findById(task.id)).toBe(task)
    })

    it('updates an existing task when the id already exists', () => {
      const task = createTask()
      repository.save(task)

      const updated = createTask({ name: 'Updated name' })
      repository.save(updated)

      expect(repository.findById(task.id)).toBe(updated)
      expect(repository.findAll()).toEqual([updated])
    })
  })

  describe('findAll', () => {
    it('returns an empty array when there are no tasks', () => {
      expect(repository.findAll()).toEqual([])
    })

    it('returns every saved task', () => {
      const first = createTask({ id: FIRST_ID })
      const second = createTask({ id: SECOND_ID })
      repository.save(first)
      repository.save(second)

      expect(repository.findAll()).toEqual([first, second])
    })
  })

  describe('findById', () => {
    it('returns the task when it exists', () => {
      const task = createTask()
      repository.save(task)

      expect(repository.findById(FIRST_ID)).toBe(task)
    })

    it('returns undefined when the task does not exist', () => {
      expect(repository.findById(SECOND_ID)).toBeUndefined()
    })
  })
})
