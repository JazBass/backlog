import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import { CreateTaskUseCase, type CreateTaskInput } from './create-task.usecase'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('CreateTaskUseCase', () => {
  let repository: InMemoryTaskRepository
  let useCase: CreateTaskUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    useCase = new CreateTaskUseCase(repository)
  })

  it('creates a task with a generated UUID', () => {
    const task = useCase.execute({ name: 'Write the use case', priority: 'medium' })

    expect(task.id).toMatch(UUID_REGEX)
  })

  it('passes the input through to the created task', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const input: CreateTaskInput = {
      name: 'Ship the MVP',
      description: 'First version of the backlog app',
      priority: 'high',
      dueDate,
    }

    const task = useCase.execute(input)

    expect(task.name).toBe('Ship the MVP')
    expect(task.description).toBe('First version of the backlog app')
    expect(task.priority).toBe('high')
    expect(task.status).toBe('todo')
    expect(task.dueDate?.getTime()).toBe(dueDate.getTime())
  })

  it('saves the created task in the repository', () => {
    const task = useCase.execute({ name: 'Write the use case', priority: 'medium' })

    expect(repository.findById(task.id)).toBe(task)
  })

  it('generates a different UUID for every task', () => {
    const first = useCase.execute({ name: 'First task', priority: 'low' })
    const second = useCase.execute({ name: 'Second task', priority: 'low' })

    expect(first.id).not.toBe(second.id)
  })

  it('propagates entity validation errors', () => {
    expect(() => useCase.execute({ name: '   ', priority: 'medium' })).toThrow(/name is required/i)
  })
})
