import { ValidationError } from '../errors/domain.error'

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const NAME_MAX_LENGTH = 25

export interface TaskProps {
  id: string
  name: string
  description?: string
  priority: TaskPriority
  status?: TaskStatus
  createdAt?: Date
  updatedAt?: Date
  dueDate?: Date
}

export interface TaskJSON {
  id: string
  name: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface TaskUpdate {
  name?: string
  description?: string
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: Date
}

export class Task {
  readonly id: string
  readonly createdAt: Date

  private _name: string
  private _description: string
  private _priority: TaskPriority
  private _status: TaskStatus
  private _updatedAt: Date
  private _dueDate: Date | undefined

  constructor(props: TaskProps) {
    const status = props.status ?? 'todo'

    validateName(props.name)
    validatePriority(props.priority)
    validateStatus(status)
    if (props.dueDate !== undefined) {
      validateDueDate(props.dueDate)
    }

    this.id = props.id
    this._name = props.name
    this._description = props.description ?? ''
    this._priority = props.priority
    this._status = status
    this.createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? this.createdAt
    this._dueDate = props.dueDate
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get priority(): TaskPriority {
    return this._priority
  }

  get status(): TaskStatus {
    return this._status
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get dueDate(): Date | undefined {
    return this._dueDate
  }

  markInProgress(): void {
    this.transitionTo('in_progress')
  }

  markDone(): void {
    this.transitionTo('done')
  }

  markTodo(): void {
    this.transitionTo('todo')
  }

  toJSON(): TaskJSON {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      priority: this._priority,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      dueDate: this._dueDate?.toISOString(),
    }
  }

  update(patch: TaskUpdate): void {
    const next = {
      name: patch.name ?? this._name,
      description: patch.description ?? this._description,
      priority: patch.priority ?? this._priority,
      status: patch.status ?? this._status,
    }

    // Validate everything before mutating so a failed update leaves the task untouched
    validateName(next.name)
    validatePriority(next.priority)
    validateStatus(next.status)
    if (patch.dueDate !== undefined) {
      validateDueDate(patch.dueDate)
    }

    this._name = next.name
    this._description = next.description
    this._priority = next.priority
    this._status = next.status
    if (patch.dueDate !== undefined) {
      this._dueDate = patch.dueDate
    }
    this._updatedAt = new Date()
  }

  private transitionTo(status: TaskStatus): void {
    this._status = status
    this._updatedAt = new Date()
  }
}

function validateName(name: string): void {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new ValidationError('Task name is required')
  }
  if (name.length > NAME_MAX_LENGTH) {
    throw new ValidationError(`Task name cannot exceed ${NAME_MAX_LENGTH} characters`)
  }
}

function validatePriority(priority: TaskPriority): void {
  if (!TASK_PRIORITIES.includes(priority)) {
    throw new ValidationError(`Invalid task priority: ${priority}`)
  }
}

function validateStatus(status: TaskStatus): void {
  if (!TASK_STATUSES.includes(status)) {
    throw new ValidationError(`Invalid task status: ${status}`)
  }
}

function validateDueDate(dueDate: Date): void {
  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    throw new ValidationError('Task dueDate must be a valid date')
  }
  if (dueDate.getTime() <= Date.now()) {
    throw new ValidationError('Task dueDate must be in the future')
  }
}
