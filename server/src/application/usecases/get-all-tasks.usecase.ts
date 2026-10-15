import type { Task } from '../../domain/entities/task.entity'
import type { TaskRepository } from '../../domain/ports/task.repository'

export class GetAllTasksUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(): Task[] {
    return this.repository.findAll()
  }
}
