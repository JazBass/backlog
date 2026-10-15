import { z } from 'zod'

import {
  NAME_MAX_LENGTH,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../../../domain/entities/task.entity'

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

export const taskIdParamsSchema = z.object({
  id: z.uuid(),
})

export const updateTaskSchema = z
  .object({
    name: z
      .string()
      .transform((value) => value.trim())
      .pipe(z.string().min(1).max(NAME_MAX_LENGTH))
      .optional(),
    description: z.string().optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    status: z.enum(TASK_STATUSES).optional(),
    dueDate: z
      .iso.datetime()
      .transform((value) => new Date(value))
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
