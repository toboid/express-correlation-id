import { Request, Response, NextFunction } from 'express';

export interface CorrelationIdRequest extends Request {
  correlationId: () => string | undefined;
  setCorrelationId: (id: string) => void;
}

export interface CorrelationOptions {
  header?: string;
}

export interface CorrelationMw {
  (options?: CorrelationOptions): (req: CorrelationIdRequest, res: Response, next: NextFunction) => void;
  getId: () => string | undefined;
  setId: (id: string) => void;
}