import type { TaskRepository } from '../../domain/ports/task.repository'

export class DeleteTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(id: string): boolean {
    return this.repository.delete(id)
  }
}
