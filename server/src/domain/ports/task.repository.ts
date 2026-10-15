import type { Task } from '../entities/task.entity'

export interface TaskRepository {
  save(task: Task): Task
  findAll(): Task[]
  findById(id: string): Task | undefined
  delete(id: string): boolean
}
