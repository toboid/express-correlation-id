'use strict';

const correlator = require('correlation-id');

module.exports = correlationMw;

function correlationMw () {
  return (req, res, next) => {
    // TODO: set id if it's present in the incoming request header
    req.correlationId = correlator.getId;
    correlator.withId(next);
  };
}

correlationMw.getId = correlator.getId;
