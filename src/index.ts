'use strict';

import * as correlator from 'correlation-id';
import { Request, Response, NextFunction } from 'express';

interface CorrelationIdRequest extends Request {
  correlationId: () => string | undefined;
  setCorrelationId: (id: string) => void;
}

interface CorrelationOptions {
  header?: string;
}

interface CorrelationMw {
  (options?: CorrelationOptions): (req: Request, _res: Response, next: NextFunction) => void;
  getId: typeof correlator.getId;
  setId: typeof correlator.setId;
}

const correlationMw = function (options?: CorrelationOptions) {
  const headerName = (options && options.header) || 'x-correlation-id';

  return (req: Request, _res: Response, next: NextFunction): void => {
    (req as CorrelationIdRequest).correlationId = correlator.getId;
    (req as CorrelationIdRequest).setCorrelationId = correlator.setId;
    const id = req.get(headerName);
    if (id) {
      correlator.withId(id, next);
    } else {
      correlator.withId(next);
    }
  };
} as CorrelationMw;

correlationMw.getId = correlator.getId;
correlationMw.setId = correlator.setId;

export = correlationMw;