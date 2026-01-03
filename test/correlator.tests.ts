import { it } from 'node:test';
import express from 'express';
import request from 'supertest';
import correlator from '../src/index';
import type { CorrelationIdRequest } from '../src/types';

const uuidMatcher =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

it('sets id from incoming request', async (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.get('/', (req: CorrelationIdRequest, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.assert.strictEqual(actual, testId);
      res.end();
    });
  });

  return request(app).get('/').set('x-correlation-id', testId);
});

it('uses configured header name', async (t) => {
  t.plan(1);

  const headerName = 'x-foo';
  const testId = 'correlator-123';

  const app = express();
  app.use(correlator({ header: headerName }));
  app.get('/', (req: CorrelationIdRequest, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.assert.strictEqual(actual, testId);
      res.end();
    });
  });

  return request(app).get('/').set(headerName, testId);
});

it('sets id using req.setCorrelationId(id)', async (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.use((req: CorrelationIdRequest, res, next) => {
    req.setCorrelationId(testId);
    next();
  });
  app.get('/', (req: CorrelationIdRequest, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.assert.strictEqual(actual, testId);
      res.end();
    });
  });

  return request(app).get('/');
});

it('sets id using correlator.setId(id)', async (t) => {
  t.plan(1);

  const testId = 'correlator-123';

  const app = express();
  app.use(correlator());
  app.use((req: CorrelationIdRequest, res, next) => {
    correlator.setId(testId);
    next();
  });
  app.get('/', (req: CorrelationIdRequest, res) => {
    setTimeout(() => {
      const actual = req.correlationId();
      t.assert.strictEqual(actual, testId);
      res.end();
    });
  });

  return request(app).get('/');
});

it('gets the id with correlator.getId() and ', async (t) => {
  t.plan(2);

  const app = express();
  app.use(correlator());
  app.get('/', (req: CorrelationIdRequest, res) => {
    setTimeout(() => {
      const actualGetId = correlator.getId();
      const actualCorrelationid = req.correlationId();
      t.assert.strictEqual(actualGetId, actualCorrelationid);
      t.assert.match(actualGetId, uuidMatcher);
      res.end();
    });
  });

  return request(app).get('/');
});
