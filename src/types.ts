export type ProcessStatus = 'pending'|'fulfilled'|'rejected'

export interface Process<T> {
  id: number
  status: ProcessStatus
  process: () => Promise<T>
  response?: T
  ping?: number
}

export interface ConcurrentOptions {
  workers: number
  withPing?: boolean
}
