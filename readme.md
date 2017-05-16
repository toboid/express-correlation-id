[![Build Status](https://travis-ci.org/toboid/express-correlation-id.svg?branch=master)](https://travis-ci.org/toboid/express-correlation-id)
[![Coverage Status](https://coveralls.io/repos/github/toboid/express-correlation-id/badge.svg?branch=master)](https://coveralls.io/github/toboid/express-correlation-id?branch=master)
[![Dependencies](https://david-dm.org/toboid/express-correlation-id.svg)](https://github.com/toboid/express-correlation-id/blob/master/package.json)
[![npm version](https://badge.fury.io/js/express-correlation-id.svg)](https://badge.fury.io/js/express-correlation-id)
[![Greenkeeper badge](https://badges.greenkeeper.io/toboid/express-correlation-id.svg)](https://greenkeeper.io/)

# Express correlation id
Express middleware to set a [correlation id](https://github.com/toboid/correlation-id) per route in express. The correlation id will be consistent across async calls within the handling of a request.

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
  console.log('ID for this request is:', req.correlationId()); // id for this request
  console.log('ID for this request is:', correlator.getId());  // equal to above, not dependant on the req object
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
Returns the id for the current request. If called outside of a request returns `undefined`. This function is useful if you don't want to pass the `req` object or correlation id from the handler to downstream code.

```javascript
correlator.getId(); // Returns the current id or undefined
```

### `req.correlationId()`
Returns the id for the current request. This function is added to the incoming `req` by the middleware.

```javascript
req.correlationId(); // Returns the current id
```

## License
MIT