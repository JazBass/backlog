import type { Task, TaskUpdate } from '../../domain/entities/task.entity'
import type { TaskRepository } from '../../domain/ports/task.repository'

export class UpdateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(id: string, patch: TaskUpdate): Task | undefined {
    const task = this.repository.findById(id)

    if (task === undefined) {
      return undefined
    }

    task.update(patch)

    return this.repository.save(task)
  }
}
