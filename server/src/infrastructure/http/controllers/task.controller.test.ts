import type { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Task } from '../../../domain/entities/task.entity'
import { createTaskUseCase, getAllTasksUseCase, getTaskUseCase } from '../../../main/container'
import { createTask, getAllTasks, getTaskById } from './task.controller'

vi.mock('../../../main/container', () => ({
  createTaskUseCase: { execute: vi.fn() },
  getAllTasksUseCase: { execute: vi.fn() },
  getTaskUseCase: { execute: vi.fn() },
}))

const TASK_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

function createSampleTask(): Task {
  return new Task({
    id: TASK_ID,
    name: 'Ship the MVP',
    priority: 'high',
  })
}

function createContext(input: { body?: unknown; params?: unknown } = {}) {
  const req = {
    body: input.body ?? {},
    params: input.params ?? {},
  } as unknown as Request

  const json = vi.fn()
  const status = vi.fn(() => ({ json }))
  const res = { status } as unknown as Response

  return { req, res, status, json }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('createTask', () => {
  it('creates the task through the use case and responds 201 with { data: task }', () => {
    const task = createSampleTask()
    const body = { name: 'Ship the MVP', priority: 'high' }
    vi.mocked(createTaskUseCase.execute).mockReturnValue(task)
    const { req, res, status, json } = createContext({ body })

    createTask(req, res)

    expect(createTaskUseCase.execute).toHaveBeenCalledWith(body)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({ data: task })
  })
})

describe('getAllTasks', () => {
  it('responds 200 with { data: tasks }', () => {
    const tasks = [createSampleTask()]
    vi.mocked(getAllTasksUseCase.execute).mockReturnValue(tasks)
    const { req, res, status, json } = createContext()

    getAllTasks(req, res)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ data: tasks })
  })

  it('responds 200 with an empty list when there are no tasks', () => {
    vi.mocked(getAllTasksUseCase.execute).mockReturnValue([])
    const { req, res, status, json } = createContext()

    getAllTasks(req, res)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ data: [] })
  })
})

describe('getTaskById', () => {
  it('responds 200 with { data: task } when the task exists', () => {
    const task = createSampleTask()
    vi.mocked(getTaskUseCase.execute).mockReturnValue(task)
    const { req, res, status, json } = createContext({ params: { id: TASK_ID } })

    getTaskById(req, res)

    expect(getTaskUseCase.execute).toHaveBeenCalledWith(TASK_ID)
    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ data: task })
  })

  it('responds 404 with an error when the task does not exist', () => {
    vi.mocked(getTaskUseCase.execute).mockReturnValue(undefined)
    const { req, res, status, json } = createContext({ params: { id: TASK_ID } })

    getTaskById(req, res)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: 'Task not found' })
  })
})
