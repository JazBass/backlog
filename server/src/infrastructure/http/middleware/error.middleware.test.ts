import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ValidationError } from '../../../domain/errors/domain.error'
import { errorMiddleware } from './error.middleware'

function createContext(options: { headersSent?: boolean } = {}) {
  const req = {} as unknown as Request
  const json = vi.fn()
  const status = vi.fn(() => ({ json }))
  const res = {
    status,
    headersSent: options.headersSent ?? false,
  } as unknown as Response
  const next = vi.fn()

  return { req, res, status, json, next }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('errorMiddleware', () => {
  it('responds 400 with { error: message } for validation errors', () => {
    const error = new ValidationError('Task dueDate must be in the future')
    const { req, res, status, json, next } = createContext()

    errorMiddleware(error, req, res, next as unknown as NextFunction)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ error: 'Task dueDate must be in the future' })
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 500 with a generic error and logs unexpected errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('boom')
    const { req, res, status, json, next } = createContext()

    errorMiddleware(error, req, res, next as unknown as NextFunction)

    expect(status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({ error: 'Internal server error' })
    expect(consoleError).toHaveBeenCalledWith(error)
    expect(next).not.toHaveBeenCalled()
  })

  it('delegates to the next error handler when the response was already sent', () => {
    const error = new Error('boom')
    const { req, res, status, json, next } = createContext({ headersSent: true })

    errorMiddleware(error, req, res, next as unknown as NextFunction)

    expect(next).toHaveBeenCalledWith(error)
    expect(status).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })
})
