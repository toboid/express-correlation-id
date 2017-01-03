'use strict';

const test = require('ava');
const express = require('express');
const request = require('supertest');
const correlator = require('../index');

const uuidMatcher = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const testCases = [{
  name: 'req.correlationId()',
  assertion: (req, t) => {
    const actual = req.correlationId();
    t.regex(actual, uuidMatcher, 'correlationId() should return a uuid');
  }
}, {
  name: 'correlator.getId()',
  assertion: (req, t) => {
    const actual = correlator.getId();
    const expected = req.correlationId();
    t.is(actual, expected, 'getId() and correlationId() should return the same uuid');
  }
}];

testCases.forEach(testCase => {
  test.cb(testCase.name, t => {
    t.plan(1);

    const app = express();
    app.use(correlator());
    app.get('/', (req, res) => {
      testCase.assertion(req, t);
      res.end();
    });

    request(app)
      .get('/')
      .end(t.end);
  });
});
