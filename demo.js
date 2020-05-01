const Retry = require('./index')

let i = 0

Retry
    .debug()
    .delay(300)
    .max(10)
    .when(result => result !== 20)
    .repeat(() => {
        i++
        return i
    })
    .then(result => {
        console.log('result:', result)
    })
