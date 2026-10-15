import type { Task } from '../../domain/entities/task.entity'
import { inMemoryTaskRepository } from '../../infrastructure/persistence/repositories/in-memory-task.repository'
import type { TaskRepository } from '../../domain/ports/task.repository'

export class GetTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(id: string): Task | undefined {
    return this.repository.findById(id)
  }
}

// Singleton wired to the in-memory repository (MVP)
export const getTaskUseCase = new GetTaskUseCase(inMemoryTaskRepository)
