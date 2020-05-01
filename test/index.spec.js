const assert = require('assert')
const Retry = require('../index')

describe('class Retry test, wating...', function() {
    this.timeout(5000)

    it('test example sync', async () => {
        let i = 0

        await Retry.delay(100)
            .max(10)
            .when(result => result !== 10)
            .repeat(() => ++i)
            .then(result => assert.equal(10, result))
    })

    it('test example async', async () => {
        let i = 0

        await Retry.delay(100)
            .max(10)
            .when(result => result !== 10)
            .repeat(async () => ++i)
            .then(result => assert.equal(10, result))
    })
})
