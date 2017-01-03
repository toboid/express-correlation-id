'use strict';

const correlator = require('correlation-id');

module.exports = correlationMw;

function correlationMw () {
  return (req, res, next) => {
    req.correlationId = correlator.getId;
    const id = req.get('x-correlation-id');
    if (id) {
      correlator.withId(id, next);
    } else {
      correlator.withId(next);
    }
  };
}

correlationMw.getId = correlator.getId;
