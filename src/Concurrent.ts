import {
  ConcurrentOptions,
  ProcessStatus,
  Process
} from './types'

class ConcurrentPromise<T> {
  private workers: number = 0
  private counter: number = 0
  private withPing: boolean = false
  private process: Process<T>[] = []
  
  constructor(initialOpts: ConcurrentOptions) {
    this.setup(initialOpts)
  }

  public setup(opts: ConcurrentOptions): this {
    this.workers = opts.workers
    this.withPing = opts.withPing || this.withPing
    return this
  }

  public add(process: () => Promise<T>): this {
    this.process.push({
      id: ++this.counter,
      status: 'pending',
      process
    })
    return this
  }

  public getProcess(id: number): Process<T> {
    return this.process[id - 1]
  }

  public getListedProcess(status?: ProcessStatus): Process<T>[] {
    return status
      ? this.process.filter(data => data.status === status)
      : this.process
  }

  public async run(): Promise<Process<T>[]> {
    const { workers, process, withPing } = this
    const max = Math.ceil(process.length / workers)
    const result: Process<T>[] = []
    for (let i = 1; i <= max; i++) {
      const offset = ((i - 1) * workers) + 1
      const limit = i * workers
      const splittedProcess: Process<T>[] = process.slice(offset - 1, limit)
      await Promise.all(splittedProcess.map(item => {
        const startPing = new Date().getTime()
        const onSettled = (status: ProcessStatus) => (response?: T) => {
          const ping = Math.abs(new Date().getTime() - startPing)
          const data = {
            id: item.id,
            status,
            response,
            process: item.process,
            ...(withPing && { ping })
          }
          result.push(data)
          return data
        }
        return item.process()
          .then(onSettled('fulfilled'))
          .catch(onSettled('rejected'))
      }))
    }
    this.process = result
    return result
  }
}

export default ConcurrentPromise
