import type { Task } from '../../../domain/entities/task.entity'
import type { TaskRepository } from '../../../domain/ports/task.repository'

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>()

  save(task: Task): Task {
    this.tasks.set(task.id, task)
    return task
  }

  findAll(): Task[] {
    return Array.from(this.tasks.values())
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  delete(id: string): boolean {
    return this.tasks.delete(id)
  }
}
