import { z } from 'zod'

import { NAME_MAX_LENGTH, TASK_PRIORITIES } from '../domain/entities/task.entity'

export const createTaskSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1).max(NAME_MAX_LENGTH)),
  description: z.string().optional(),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z
    .iso.datetime()
    .transform((value) => new Date(value))
    .optional(),
})

export const getTaskByIdSchema = z.object({
  id: z.uuid(),
})
