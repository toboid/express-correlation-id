# Express correlation id

## Installation
```shell
npm i express-correlation-id --save
```

## Middleware usage example
All middleware and route handlers following the `correlator()` middleware will be within a single correlation scope. If the incoming request has a header called `x-correlation-id` then it's value will be used as the id for this request, otherwise the id will be a new uuid.

```javascript
const correlator = require('express-correlation-id');
const express = require('express');

const app = express();
app.use(correlator());

app.get('/', (req, res) => {
  console.log('ID for this request is:', correlator.getId());
  console.log('ID for this request is:', req.correlationId());
  res.end();
})
```

## API

### `correlator()`
Returns an express middleware that creates a correlation scope for all following middleware and route handlers. If the incoming request has a header with name `x-correlation-id` then it's value will be used as the id.

```javascript
const app = express();
app.use(correlator());
```

### `correlator.getId()`
Returns the id for the current request. If called outside of a request returns `undefined`.

```javascript
correlator.getId(); // Returns the current id or undefined
```

### `req.correlationId()`
Returns the id for the current request. This function is added to the incoming `req` by the middleware.

```javascript
req.correlationId(); // Returns the current id
```