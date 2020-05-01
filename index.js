/**
 * Retry
 * 
 * @author gavinning
 * @description 失败自动重试，可用于http请求重试，或其他需要重试的逻辑
 * 
 */

class Retry {
    constructor(interval) {
        this.i = 0
        this.count = 10
        // ms, min:10ms, default:300ms
        this.interval = Math.max(10, interval || 300)
    }

    sleep() {
        return new Promise((resolve) => {
            setTimeout(resolve, this.interval)
        })
    }

    max(count) {
        this.count = count
        return this
    }

    when(callback) {
        this.failure = callback
        return this
    }

    async repeat(callback) {
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
        }
        catch(err) {
            this.print(this.i - 1, 'Repeating ----:', result)

            // 重试次数限制，超出次数抛出当前异常
            if (this.i > this.count) {
                throw err
            }
            await this.sleep()
            return this.repeat(callback)
        }
    }

    print() {
        if (Retry.debugMode && this.i > 1) {
            console.log(...arguments)
        }
    }

    static debug(mode = true) {
        this.debugMode = mode
        return this
    }

    static delay(interval) {
        return new Retry(interval)
    }

    static max(count) {
        return new Retry().max(count)
    }

    static when(callback) {
        return new Retry().when(callback)
    }
}

module.exports = Retry
