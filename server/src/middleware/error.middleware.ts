import type { NextFunction, Request, Response } from 'express'

import { ValidationError } from '../domain/errors/domain.error'

/**
 * Central error handler. Must be registered after all routes so Express can
 * route errors here. The 4-argument signature is what marks it as an error
 * handler for Express.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
