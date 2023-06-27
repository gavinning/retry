## Retry

失败自动重试，可用于 http 请求重试，或其他需要重试的逻辑

### Install

```sh
npm i @4a/retry
```

### Usage

```js
// ES6
import Retry from '@4a/retry'

// Nodejs
const Retry = require('@4a/retry')
```

### Example

```js
let i = 0

Retry.delay(300) // 可选调用 重试间隔300ms，默认300ms，单位ms
  .max(10) // 可选调用 重试次数10，默认3次防止死循环
  .when((result) => result !== 10) // 必须调用 重试条件，符合条件则重试，否则视为成功正常返回
  .repeat(() => {
    // 支持async函数，支持promise，返回Promise
    i++
    return i
  })
  .then((result) => {
    console.log('result:', result)
  })
  .catch((err) => {
    // 报错视为失败
    // 最后一次重试如果依然报错，则抛出该错误
    console.error('error:', err)
  })
```

Simple

```js
let i = 0

Retry.when((result) => result !== 10)
  .repeat(() => {
    i++
    return i
  })
  .then((result) => {
    console.log('result:', result)
  })
  .catch((err) => {
    console.error('error:', err)
  })
```

Axios Request

```js
Retry.when((result) => result.data.code !== 0)
  .repeat(() => axios(options))
  .then((result) => {
    console.log('result:', result)
  })
  .catch((err) => {
    console.error('error:', err)
  })
```

<br />

> npm test
