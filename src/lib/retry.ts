/**
 * Retry
 *
 * @author gavinning <gavinning@qq.com>
 * @description 失败自动重试，可用于http请求重试，或其他需要重试的逻辑
 *
 */

export type AnyFunction<T> = (...args: any[]) => T

export class Retry<R = any> {
  private i: number
  private count: number
  private interval: number
  private failure: AnyFunction<boolean> = () => true
  static debugMode = false

  /**
   *
   * @param interval 重试间隔时间，单位ms，min:20ms, default:300ms
   */
  constructor(interval: number = 300) {
    this.i = 0
    this.count = 3
    // ms, min:10ms, default:300ms
    this.interval = Math.max(20, interval || 300)
  }

  sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, this.interval)
    })
  }

  max(count: number) {
    this.count = count
    return this
  }

  when(callback: AnyFunction<boolean>) {
    this.failure = callback
    return this
  }

  async repeat(callback: AnyFunction<any>): Promise<R> {
    var result

    try {
      this.i++

      result = await callback()

      this.print(this.i - 1, 'Repeating ----:', result)

      // 重试次数限制，超出次数限制直接返回结果
      if (this.i > this.count) {
        return result
      }

      // 检查重试条件
      if (this.failure(result)) {
        await this.sleep()
        return this.repeat(callback)
      }

      // 你所期待的
      return result
    } catch (err) {
      this.print(this.i - 1, 'Repeating ----:', result)

      // 重试次数限制，超出次数抛出当前异常
      if (this.i > this.count) {
        throw err
      }
      await this.sleep()
      return this.repeat(callback)
    }
  }

  print(...args: any[]) {
    if (Retry.debugMode && this.i > 1) {
      console.log(...args)
    }
  }

  static debug(mode = false) {
    this.debugMode = mode
    return this
  }

  static delay<T = any>(interval: number) {
    return new Retry<T>(interval)
  }

  static max<T = any>(count: number) {
    return new Retry<T>().max(count)
  }

  static when<T = any>(callback: AnyFunction<boolean>) {
    return new Retry<T>().when(callback)
  }
}

export default Retry
