import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${new Date().toISOString()}`, err.message);
  
  // Never expose stack trace in production
  const errorResponse = {
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  res.status(500).json(errorResponse);
};
