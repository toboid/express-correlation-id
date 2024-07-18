# Express correlation id

Express middleware to set a [correlation id](https://github.com/toboid/correlation-id) per route in express. The correlation id will be consistent across async calls within the handling of a request.

## Compatibility

From v3 onwards this library requires node >=16. For older node versions use v2.x.

## Installation

```shell
npm i express-correlation-id --save
```

## Middleware usage example

All middleware and route handlers following the `correlator()` middleware will be within a single correlation scope. If the incoming request has a header called `x-correlation-id` then it's value will be used as the id for this request, otherwise the id will be a new uuid.

**Note:** the correlator middleware should be placed after any other middleware.

```javascript
const correlator = require('express-correlation-id');
const express = require('express');

const app = express();
// app.use other middleware here
app.use(correlator());

app.get('/', (req, res) => {
  console.log('ID for this request is:', req.correlationId()); // id for this request
  console.log('ID for this request is:', correlator.getId()); // equal to above, not dependant on the req object
  res.end();
});
```

## API

### `correlator([options])`

Returns an express middleware that creates a correlation scope for all following middleware and route handlers. If the incoming request has a header with name `x-correlation-id` then it's value will be used as the id. The header name is configurable, see options below.
To ensure the correlation id is available to other middleware, ensure that it's applied after them.

```javascript
const app = express();
// app.use other middleware here
app.use(correlator());
```

#### options

Options to configure the correlator middleware.

##### `header`

Configures the name of the inbound header to check for a correlation id.

```javascript
const app = express();
app.use(correlator({ header: 'x-my-correlation-header-name' }));
```

### `correlator.getId()`

Returns the id for the current request. If called outside of a request returns `undefined`. This function is useful if you don't want to pass the `req` object or correlation id from the handler to downstream code.

```javascript
correlator.getId(); // Returns the current id or undefined
```

### `req.correlationId()`

Returns the id for the current request. This function is added to the incoming `req` by the middleware.

```javascript
req.correlationId(); // Returns the current id
```

### `correlator.setId(id)`

Sets the id for the current request. If called outside of a request throws and error. Useful if you
need to set the correlatiaon id and don't want to pass `req` object from the haandler to downstreama code.

```javascript
correlator.setId('my-new-id');
```

### `req.setCorrelationId()`

Sets the id for the current request. This function is added to the incoming `req` by the middleware.

```javascript
req.setCorrelationId('my-new-id');
```

## License

MIT
