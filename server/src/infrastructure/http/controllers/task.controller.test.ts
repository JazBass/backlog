import type { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Task } from '../../../domain/entities/task.entity'
import {
  createTaskUseCase,
  deleteTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
  updateTaskUseCase,
} from '../../../main/container'
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from './task.controller'

vi.mock('../../../main/container', () => ({
  createTaskUseCase: { execute: vi.fn() },
  getAllTasksUseCase: { execute: vi.fn() },
  getTaskUseCase: { execute: vi.fn() },
  updateTaskUseCase: { execute: vi.fn() },
  deleteTaskUseCase: { execute: vi.fn() },
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
  const end = vi.fn()
  const status = vi.fn(() => ({ json, end }))
  const res = { status } as unknown as Response

  return { req, res, status, json, end }
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

describe('updateTask', () => {
  it('updates through the use case and responds 200 with { data: task }', () => {
    const task = createSampleTask()
    const body = { name: 'Updated name', priority: 'low' }
    vi.mocked(updateTaskUseCase.execute).mockReturnValue(task)
    const { req, res, status, json } = createContext({ body, params: { id: TASK_ID } })

    updateTask(req, res)

    expect(updateTaskUseCase.execute).toHaveBeenCalledWith(TASK_ID, body)
    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ data: task })
  })

  it('responds 404 with an error when the task does not exist', () => {
    vi.mocked(updateTaskUseCase.execute).mockReturnValue(undefined)
    const { req, res, status, json } = createContext({
      body: { name: 'Updated name' },
      params: { id: TASK_ID },
    })

    updateTask(req, res)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: 'Task not found' })
  })
})

describe('deleteTask', () => {
  it('deletes through the use case and responds 204', () => {
    vi.mocked(deleteTaskUseCase.execute).mockReturnValue(true)
    const { req, res, status, end } = createContext({ params: { id: TASK_ID } })

    deleteTask(req, res)

    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith(TASK_ID)
    expect(status).toHaveBeenCalledWith(204)
    expect(end).toHaveBeenCalled()
  })

  it('responds 404 with an error when the task does not exist', () => {
    vi.mocked(deleteTaskUseCase.execute).mockReturnValue(false)
    const { req, res, status, json } = createContext({ params: { id: TASK_ID } })

    deleteTask(req, res)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: 'Task not found' })
  })
})
