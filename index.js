'use strict';

const correlator = require('correlation-id');

module.exports = correlationMw;

function correlationMw (options) {
  const headerName = (options && options.header) || 'x-correlation-id';

  return (req, res, next) => {
    req.correlationId = correlator.getId;
    req.setCorrelationId = correlator.setId;
    const id = req.get(headerName);
    if (id) {
      correlator.withId(id, next);
    } else {
      correlator.withId(next);
    }
  };
}

correlationMw.getId = correlator.getId;
correlationMw.setId = correlator.setId;
