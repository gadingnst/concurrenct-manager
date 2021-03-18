# 🔀 Concurrent Promise
[![Build Status](https://travis-ci.org/sutanlab/concurrent-promise.svg?branch=main)](https://travis-ci.org/sutanlab/concurrent-promise)

#### 🧪 This project is under experiment! (documentation is not ready yet.)
#### Soon will be published at NPM 🚀

### The Problem
***Asynchronous process*** may cause memory leak. *How it possible?* if we execute 10000+ tasks of asynchronous process simultaneously without seperate it.
And then, we usually use synchronous process to avoid that. So...

***Why choose between asynchronous and synchronous if we can use both of them all at a time?***

That's why you should to use this utility! 😁
This utility can seperate the asynchronous that execute all process concurrently into a small group of asynchronous processes to run sequentially for performance stability.

### API Usage
API usage is simple! You should go to `example.ts` to check the example usage. The expected output from `example.ts` maybe like this:

```
[
  {
    id: 1,
    status: 'fulfilled',
    response: '1.5 SEC',
    process: [Function (anonymous)],
    ping: 1506
  },
  {
    id: 2,
    status: 'fulfilled',
    response: '0.25 SEC',
    process: [Function (anonymous)],
    ping: 254
  },
  {
    id: 3,
    status: 'rejected',
    response: '1 SEC. (ERROR!!)',
    process: [Function (anonymous)],
    ping: 1006
  }
]
Process with 1 worker: 2.775s
```
On the first try, we used 1 workers. The output time as we can see is `2.7s`. Why? because if we use 1 worker, the `process` will be executed sequentially from `process 1` to `process 3`. `1506 + 254 + 1006 = 2766ms (~= 2.755s)`.

```
[
  {
    id: 2,
    status: 'fulfilled',
    response: '0.25 SEC',
    process: [Function (anonymous)],
    ping: 254
  },
  {
    id: 1,
    status: 'fulfilled',
    response: '1.5 SEC',
    process: [Function (anonymous)],
    ping: 1505
  },
  {
    id: 3,
    status: 'rejected',
    response: '1 SEC. (ERROR!!)',
    process: [Function (anonymous)],
    ping: 1005
  }
]
Process with 2 workers: 2.511s
```
The execution time we got in second try is `2.5s` because `process 1` and `process 2` is executed simultaneously, except `process 3`. `process 3` is executed after `process 1` and `process 2` are settled. And then, the `process 2` is settled earlier than `process 1`, that's why `process 2` comes in first order.

```
[
  {
    id: 2,
    status: 'fulfilled',
    response: '0.25 SEC',
    process: [Function (anonymous)],
    ping: 252
  },
  {
    id: 3,
    status: 'rejected',
    response: '1 SEC. (ERROR!!)',
    process: [Function (anonymous)],
    ping: 1006
  },
  {
    id: 1,
    status: 'fulfilled',
    response: '1.5 SEC',
    process: [Function (anonymous)],
    ping: 1505
  }
]
Process with 3 workers: 1.506s
```
In the last try, we used 3 workers and get output time `1.5s`. Becasue the three of them is executed simultaneously and get `process 1` comes in last order because it has a higher ping than others.
 
### Conclusion
With this utility, we can easily seperate how many process to run simultanously. So, we don't need to switch the process synchronously to avoid memory leak, because we can use both synchronous and asynchronous at a time.
Maybe for now, that's all I can explain about this utility.

Happy Coding!

### LICENSE
MIT

---
Copyright © 2020 by Sutan Gading Fadhillah Nasution
