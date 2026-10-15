import type { Task } from '../../domain/entities/task.entity'
import { inMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import type { TaskRepository } from '../../domain/ports/task.repository'

export class GetAllTasksUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(): Task[] {
    return this.repository.findAll()
  }
}

// Singleton wired to the in-memory repository (MVP)
export const getAllTasksUseCase = new GetAllTasksUseCase(inMemoryTaskRepository)
