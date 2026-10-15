import type { NextFunction, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { validateRequest } from './validate-request'

const bodySchema = z.object({
  name: z.string().min(1),
  createdAt: z.string().transform((value) => new Date(value)),
})

const paramsSchema = z.object({
  id: z.string().min(1),
})

const querySchema = z.object({
  search: z.string(),
})

function createContext(input: { body?: unknown; params?: unknown; query?: unknown } = {}) {
  const req = {
    body: input.body ?? {},
    params: input.params ?? {},
    query: input.query ?? {},
  } as unknown as Request

  const json = vi.fn()
  const status = vi.fn(() => ({ json }))
  const res = { status } as unknown as Response
  const next = vi.fn()

  return { req, res, status, json, next }
}

describe('validateRequest', () => {
  describe('when the request is valid', () => {
    it('calls next without responding', () => {
      const { req, res, status, next } = createContext({
        body: { name: 'Task', createdAt: '2026-10-15T10:00:00.000Z' },
      })

      validateRequest({ body: bodySchema })(req, res, next as unknown as NextFunction)

      expect(next).toHaveBeenCalledOnce()
      expect(status).not.toHaveBeenCalled()
    })

    it('replaces the request data with the parsed values (transforms applied)', () => {
      const { req, res, next } = createContext({
        body: { name: 'Task', createdAt: '2026-10-15T10:00:00.000Z' },
      })

      validateRequest({ body: bodySchema })(req, res, next as unknown as NextFunction)

      const parsedBody = req.body as { createdAt: Date; name: string }
      expect(parsedBody.createdAt).toBeInstanceOf(Date)
      expect(parsedBody.createdAt.getTime()).toBe(new Date('2026-10-15T10:00:00.000Z').getTime())
    })
  })

  describe('when the request is invalid', () => {
    it('responds 400 with the validation error and details when the body is invalid', () => {
      const { req, res, status, json, next } = createContext({ body: {} })

      validateRequest({ body: bodySchema })(req, res, next as unknown as NextFunction)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({ path: 'name', message: expect.any(String) }),
        ]),
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('responds 400 when the params are invalid', () => {
      const { req, res, status, json, next } = createContext({ params: {} })

      validateRequest({ params: paramsSchema })(req, res, next as unknown as NextFunction)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({ path: 'id', message: expect.any(String) }),
        ]),
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('responds 400 when the query is invalid', () => {
      const { req, res, status, json, next } = createContext({ query: {} })

      validateRequest({ query: querySchema })(req, res, next as unknown as NextFunction)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({ path: 'search', message: expect.any(String) }),
        ]),
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('collects issues from every validated property', () => {
      const { req, res, json, next } = createContext({
        body: {},
        params: {},
        query: {},
      })

      validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
        req,
        res,
        next as unknown as NextFunction,
      )

      expect(json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({ path: 'name' }),
          expect.objectContaining({ path: 'createdAt' }),
          expect.objectContaining({ path: 'id' }),
          expect.objectContaining({ path: 'search' }),
        ]),
      })
    })

    it('skips validation for properties without a schema', () => {
      const { req, res, next } = createContext({
        body: { name: 'Task', createdAt: '2026-10-15T10:00:00.000Z' },
        params: {},
        query: {},
      })

      validateRequest({ body: bodySchema })(req, res, next as unknown as NextFunction)

      expect(next).toHaveBeenCalledOnce()
    })
  })
})
