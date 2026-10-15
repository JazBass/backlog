import { describe, expect, it } from 'vitest'

import { createTaskUseCase, getAllTasksUseCase, getTaskUseCase } from './container'

describe('container', () => {
  it('wires the task use cases to a shared repository', () => {
    const task = createTaskUseCase.execute({ name: 'Wired task', priority: 'medium' })

    expect(getTaskUseCase.execute(task.id)).toBe(task)
    expect(getAllTasksUseCase.execute()).toContain(task)
  })
})
