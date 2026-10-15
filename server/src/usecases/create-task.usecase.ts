import { randomUUID } from 'node:crypto'

import { Task, type TaskPriority } from '../domain/entities/task.entity'
import { inMemoryTaskRepository } from '../repositories/in-memory-task.repository'
import type { TaskRepository } from '../repositories/task.repository'

export interface CreateTaskInput {
  name: string
  description?: string
  priority: TaskPriority
  dueDate?: Date
}

export class CreateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(input: CreateTaskInput): Task {
    const task = new Task({
      id: randomUUID(),
      name: input.name,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
    })

    return this.repository.save(task)
  }
}

// Singleton wired to the in-memory repository (MVP)
export const createTaskUseCase = new CreateTaskUseCase(inMemoryTaskRepository)
