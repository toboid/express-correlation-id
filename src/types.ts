import { Request, Response, NextFunction } from 'express';

export interface CorrelationIdRequest extends Request {
  correlationId: () => string | undefined;
  setCorrelationId: (id: string) => void;
}

export interface CorrelationOptions {
  header?: string;
}

export interface CorrelationMw {
  (options?: CorrelationOptions): (req: Request, res: Response, next: NextFunction) => void;
  getId: () => string | undefined;
  setId: (id: string) => void;
}

declare global {
  namespace Express {
    interface Request {
      correlationId: () => string | undefined;
      setCorrelationId: (id: string) => void;
    }
  }
}
