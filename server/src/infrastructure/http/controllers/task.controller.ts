import type { Request, Response } from 'express'

import type { CreateTaskInput } from '../../../application/usecases/create-task.usecase'
import type { TaskUpdate } from '../../../domain/entities/task.entity'
import {
  createTaskUseCase,
  deleteTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
  updateTaskUseCase,
} from '../../../main/container'

export function createTask(req: Request, res: Response): void {
  const input: CreateTaskInput = req.body
  const task = createTaskUseCase.execute(input)

  res.status(201).json({ data: task })
}

export function getAllTasks(_req: Request, res: Response): void {
  const tasks = getAllTasksUseCase.execute()

  res.status(200).json({ data: tasks })
}

export function getTaskById(req: Request, res: Response): void {
  const task = getTaskUseCase.execute(req.params.id)

  if (task === undefined) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.status(200).json({ data: task })
}

export function updateTask(req: Request, res: Response): void {
  const patch: TaskUpdate = req.body
  const task = updateTaskUseCase.execute(req.params.id, patch)

  if (task === undefined) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.status(200).json({ data: task })
}

export function deleteTask(req: Request, res: Response): void {
  const deleted = deleteTaskUseCase.execute(req.params.id)

  if (!deleted) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.status(204).end()
}
