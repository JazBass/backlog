import { Router } from 'express'

import { createTask, getAllTasks, getTaskById } from '../controllers/task.controller'
import { validateRequest } from '../middleware/validate-request'
import { createTaskSchema, getTaskByIdSchema } from '../schemas/task.schema'

export const taskRouter = Router()

taskRouter.post('/', validateRequest({ body: createTaskSchema }), createTask)

taskRouter.get('/', getAllTasks)

taskRouter.get('/:id', validateRequest({ params: getTaskByIdSchema }), getTaskById)
