import { beforeEach, describe, expect, it } from 'vitest'

import { Task } from '../../domain/entities/task.entity'
import { InMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import { DeleteTaskUseCase } from './delete-task.usecase'

const TASK_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const MISSING_ID = '6fa459ea-ee8a-4ca4-894e-db77e160355e'

describe('DeleteTaskUseCase', () => {
  let repository: InMemoryTaskRepository
  let useCase: DeleteTaskUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    useCase = new DeleteTaskUseCase(repository)
  })

  it('deletes the task and returns true when it exists', () => {
    const task = new Task({ id: TASK_ID, name: 'Delete me', priority: 'low' })
    repository.save(task)

    expect(useCase.execute(TASK_ID)).toBe(true)
    expect(repository.findById(TASK_ID)).toBeUndefined()
  })

  it('returns false when the task does not exist', () => {
    expect(useCase.execute(MISSING_ID)).toBe(false)
  })
})
