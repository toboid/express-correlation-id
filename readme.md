# Express correlation id

## Installation
```shell
npm i express-correlation-id --save
```

## Middleware usage example
An express middleware is included. All middleware and route handlers following `correlator.express()` middleware will be within a single correlation scope.

```javascript
const correlator = require('correlation-id');
const express = require('express');

const app = express()
app.use(correlator.express());

app.get('/', (req, res) => {
  console.log('ID for this request is:', correlator.getId())
  res.end()
})
```

## API

### `express()`
Returns an express middleware that creates a correlation scope for all following middleware and route handlers.

```javascript
const app = express()
app.use(correlator.express())
```