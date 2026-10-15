import { beforeEach, describe, expect, it } from 'vitest'

import { Task } from '../../domain/entities/task.entity'
import { InMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import { GetTaskUseCase } from './get-task.usecase'

const TASK_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const MISSING_ID = '6fa459ea-ee8a-4ca4-894e-db77e160355e'

describe('GetTaskUseCase', () => {
  let repository: InMemoryTaskRepository
  let useCase: GetTaskUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    useCase = new GetTaskUseCase(repository)
  })

  it('returns the task when it exists', () => {
    const task = new Task({ id: TASK_ID, name: 'Find me', priority: 'medium' })
    repository.save(task)

    expect(useCase.execute(TASK_ID)).toBe(task)
  })

  it('returns undefined when the task does not exist', () => {
    expect(useCase.execute(MISSING_ID)).toBeUndefined()
  })
})
