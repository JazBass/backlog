import type { Request, Response } from 'express'

import type { CreateTaskInput } from '../../../application/usecases/create-task.usecase'
import { createTaskUseCase, getAllTasksUseCase, getTaskUseCase } from '../../../main/container'

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
