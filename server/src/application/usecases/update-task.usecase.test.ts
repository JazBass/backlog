import { beforeEach, describe, expect, it } from 'vitest'

import { Task } from '../../domain/entities/task.entity'
import { InMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import { UpdateTaskUseCase } from './update-task.usecase'

const TASK_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const MISSING_ID = '6fa459ea-ee8a-4ca4-894e-db77e160355e'

describe('UpdateTaskUseCase', () => {
  let repository: InMemoryTaskRepository
  let useCase: UpdateTaskUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    useCase = new UpdateTaskUseCase(repository)
  })

  it('updates the task fields and returns it', () => {
    const task = new Task({ id: TASK_ID, name: 'Old name', priority: 'low' })
    repository.save(task)

    const updated = useCase.execute(TASK_ID, { name: 'New name', priority: 'high' })

    expect(updated).toBe(task)
    expect(task.name).toBe('New name')
    expect(task.priority).toBe('high')
  })

  it('persists the updated task in the repository', () => {
    const task = new Task({ id: TASK_ID, name: 'Old name', priority: 'low' })
    repository.save(task)

    useCase.execute(TASK_ID, { name: 'New name' })

    expect(repository.findById(TASK_ID)?.name).toBe('New name')
  })

  it('returns undefined when the task does not exist', () => {
    expect(useCase.execute(MISSING_ID, { name: 'New name' })).toBeUndefined()
  })

  it('propagates entity validation errors', () => {
    const task = new Task({ id: TASK_ID, name: 'Old name', priority: 'low' })
    repository.save(task)

    expect(() => useCase.execute(TASK_ID, { name: '' })).toThrow(/name is required/i)
  })
})
