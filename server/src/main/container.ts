import { CreateTaskUseCase } from '../application/usecases/create-task.usecase'
import { GetAllTasksUseCase } from '../application/usecases/get-all-tasks.usecase'
import { GetTaskUseCase } from '../application/usecases/get-task.usecase'
import { InMemoryTaskRepository } from '../infrastructure/persistence/repositories/in-memory-task.repository'

// Composition root: the only place that knows about every layer.
// Single repository instance shared by all use cases (MVP: in-memory storage).
const taskRepository = new InMemoryTaskRepository()

export const createTaskUseCase = new CreateTaskUseCase(taskRepository)
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository)
export const getTaskUseCase = new GetTaskUseCase(taskRepository)
