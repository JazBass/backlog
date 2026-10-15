import type { Task } from '../domain/entities/task.entity'

export interface TaskRepository {
  save(task: Task): Task
  findAll(): Task[]
  findById(id: string): Task | undefined
}
