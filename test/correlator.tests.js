'use strict';

const test = require('ava');
const express = require('express');
const request = require('supertest');
const correlator = require('../index');

const uuidMatcher =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test.cb('sets id from incoming request', (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.get('/', (req, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.is(
        actual,
        testId,
        'correlationId() should return id from x-correlation-id header of inbound request'
      );
      res.end();
    });
  });

  request(app).get('/').set('x-correlation-id', testId).end(t.end);
});

test.cb('uses configured header name', (t) => {
  t.plan(1);

  const headerName = 'x-foo';
  const testId = 'correlator-123';

  const app = express();
  app.use(correlator({ header: headerName }));
  app.get('/', (req, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.is(
        actual,
        testId,
        'correlationId() should return id from configured header of inbound request'
      );
      res.end();
    });
  });

  request(app).get('/').set(headerName, testId).end(t.end);
});

test.cb('sets id using req.setCorrelationId(id)', (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.use((req, res, next) => {
    req.setCorrelationId(testId);
    next();
  });
  app.get('/', (req, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.is(
        actual,
        testId,
        'correlationId() should return id set using setCorrelationId()'
      );
      res.end();
    });
  });

  request(app).get('/').end(t.end);
});

test.cb('sets id using correlator.setId(id)', (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.use((req, res, next) => {
    correlator.setId(testId);
    next();
  });
  app.get('/', (req, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.is(
        actual,
        testId,
        'correlationId() should return id set using setCorrelationId()'
      );
      res.end();
    });
  });

  request(app).get('/').end(t.end);
});

const testCases = [
  {
    name: 'req.correlationId()',
    assertions: 1,
    assertion: (req, t) => {
      const actual = req.correlationId();
      t.regex(actual, uuidMatcher, 'correlationId() should return a uuid');
    },
  },
  {
    name: 'correlator.getId()',
    assertions: 2,
    assertion: (req, t) => {
      const actual = correlator.getId();
      const expected = req.correlationId();
      t.is(
        actual,
        expected,
        'getId() and correlationId() should return the same uuid'
      );
      t.regex(actual, uuidMatcher, 'correlationId() should return a uuid');
    },
  },
];

testCases.forEach((testCase) => {
  test.cb(testCase.name, (t) => {
    t.plan(testCase.assertions);

    const app = express();
    app.use(correlator());
    app.get('/', (req, res) => {
      setTimeout(() => {
        testCase.assertion(req, t);
        res.end();
      });
    });

    request(app).get('/').end(t.end);
  });
});
