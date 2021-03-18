import ConcurrentPromise from  './src'

async function main() {
  const concurrent = new ConcurrentPromise({ workers: 1, withPing: true }) // initial setup with 1 workers

  // asynchronous simulation with setTimeout
  concurrent
    .add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('1.5 SEC')
        }, 1500)
      })
    })
    .add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('0.25 SEC')
        }, 250)
      })
    })
    .add(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject('1 SEC. (ERROR!!)')
        }, 1000)
      })
    })
    
  console.time('Process with 1 worker')
  await concurrent.run()
  console.log(concurrent.getListedProcess())
  console.timeEnd('Process with 1 worker')
  console.log('\n')

  console.time('Process with 2 workers')
  concurrent.setup({ workers: 2 })
  await concurrent.run()
  console.log(concurrent.getListedProcess())
  console.timeEnd('Process with 2 workers')
  console.log('\n')

  console.time('Process with 3 workers')
  // make sure the method chaining works
  await concurrent
    .setup({ workers: 3 })
    .run()
  console.log(concurrent.getListedProcess())
  console.timeEnd('Process with 3 workers')
}

main()