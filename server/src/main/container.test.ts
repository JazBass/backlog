import { describe, expect, it } from 'vitest'

import {
  createTaskUseCase,
  deleteTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
  updateTaskUseCase,
} from './container'

describe('container', () => {
  it('wires the task use cases to a shared repository', () => {
    const task = createTaskUseCase.execute({ name: 'Wired task', priority: 'medium' })

    expect(getTaskUseCase.execute(task.id)).toBe(task)
    expect(getAllTasksUseCase.execute()).toContain(task)

    const updated = updateTaskUseCase.execute(task.id, { name: 'Updated wired task' })
    expect(updated?.name).toBe('Updated wired task')

    expect(deleteTaskUseCase.execute(task.id)).toBe(true)
    expect(getTaskUseCase.execute(task.id)).toBeUndefined()
  })
})
