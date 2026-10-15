import { Router } from 'express'

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '../controllers/task.controller'
import { validateRequest } from '../middleware/validate-request'
import { createTaskSchema, taskIdParamsSchema, updateTaskSchema } from '../schemas/task.schema'

export const taskRouter = Router()

taskRouter.post('/', validateRequest({ body: createTaskSchema }), createTask)

taskRouter.get('/', getAllTasks)

taskRouter.get('/:id', validateRequest({ params: taskIdParamsSchema }), getTaskById)

taskRouter.patch(
  '/:id',
  validateRequest({ params: taskIdParamsSchema, body: updateTaskSchema }),
  updateTask,
)

taskRouter.delete('/:id', validateRequest({ params: taskIdParamsSchema }), deleteTask)
