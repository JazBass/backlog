import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

export interface RequestSchemas {
  body?: ZodType
  params?: ZodType
  query?: ZodType
}

interface ValidationIssue {
  path: string
  message: string
}

const VALIDATED_PROPERTIES = ['body', 'params', 'query'] as const
type ValidatedProperty = (typeof VALIDATED_PROPERTIES)[number]

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (req, res, next) => {
    const issues: ValidationIssue[] = []
    const parsed: Partial<Record<ValidatedProperty, unknown>> = {}

    for (const property of VALIDATED_PROPERTIES) {
      const schema = schemas[property]
      if (schema === undefined) {
        continue
      }

      const result = schema.safeParse(req[property])
      if (result.success) {
        parsed[property] = result.data
      } else {
        issues.push(
          ...result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        )
      }
    }

    if (issues.length > 0) {
      res.status(400).json({ error: 'Validation failed', details: issues })
      return
    }

    // Overwrite with the parsed values so handlers receive validated (and transformed) data.
    // defineProperty is used because Express 5 exposes req.query as a getter-only property.
    for (const property of VALIDATED_PROPERTIES) {
      if (property in parsed) {
        Object.defineProperty(req, property, {
          value: parsed[property],
          writable: true,
          enumerable: true,
          configurable: true,
        })
      }
    }

    next()
  }
}
