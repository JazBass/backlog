import type { Task } from '../../domain/entities/task.entity'
import type { TaskRepository } from '../../domain/ports/task.repository'

export class GetTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(id: string): Task | undefined {
    return this.repository.findById(id)
  }
}
