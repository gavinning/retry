import { describe, it, expect } from 'vitest'
import { Retry } from '@/lib/retry'

describe('app', async () => {

  it('test example sync ok', async () => {
    let i = 0

    await Retry.delay(100)
      .max(20)
      .when((result) => result !== 10)
      .repeat(() => ++i)
      .then((result) => expect(10).toBe(result))
  })

  it('test example async ok', async () => {
    let i = 0

    await Retry.delay(100)
      .max(20)
      .when((result) => result !== 10)
      .repeat(async () => ++i)
      .then((result) => expect(10).toBe(result))
  })

  it('test example sync fail', async () => {
    let i = 0

    await Retry.delay(100)
      .max(5)
      .when((result) => result !== 10)
      .repeat(() => ++i)
      .catch(() => expect(5).toBe(i))
  })

  it('test example async fail', async () => {
    let i = 0

    await Retry.delay(100)
      .max(5)
      .when((result) => result !== 10)
      .repeat(async () => ++i)
      .catch(() => expect(5).toBe(i))
  })
})
