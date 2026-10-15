import { beforeEach, describe, expect, it } from 'vitest'

import { Task } from '../domain/entities/task.entity'
import { InMemoryTaskRepository } from '../repositories/in-memory-task.repository'
import { GetAllTasksUseCase } from './get-all-tasks.usecase'

const FIRST_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const SECOND_ID = '6fa459ea-ee8a-4ca4-894e-db77e160355e'

describe('GetAllTasksUseCase', () => {
  let repository: InMemoryTaskRepository
  let useCase: GetAllTasksUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    useCase = new GetAllTasksUseCase(repository)
  })

  it('returns an empty array when there are no tasks', () => {
    expect(useCase.execute()).toEqual([])
  })

  it('returns every task from the repository', () => {
    const first = new Task({ id: FIRST_ID, name: 'First task', priority: 'low' })
    const second = new Task({ id: SECOND_ID, name: 'Second task', priority: 'high' })
    repository.save(first)
    repository.save(second)

    expect(useCase.execute()).toEqual([first, second])
  })
})
