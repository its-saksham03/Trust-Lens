import { Request, Response, NextFunction } from 'express';

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export const rateLimiter = (options: { limit: number, windowMs: number }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Basic in-memory rate limiter for development
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const endpointsKey = `${ip}-${req.route?.path || req.path}`;
    
    const now = Date.now();
    let record = rateLimitMap.get(endpointsKey);
    
    if (!record || record.resetTime < now) {
      record = { count: 1, resetTime: now + options.windowMs };
    } else {
      record.count++;
    }
    
    rateLimitMap.set(endpointsKey, record);
    
    if (record.count > options.limit) {
      res.status(429).json({ error: 'Too many requests, please try again later.' });
      return;
    }
    
    next();
  };
};

// Global: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimiter({ limit: 100, windowMs: 15 * 60 * 1000 });

// Scan endpoint: 10 scans per minute per user (IP as fallback)
export const scanLimiter = rateLimiter({ limit: 10, windowMs: 60 * 1000 });

// Auth endpoint: 5 attempts per 15 minutes per IP
export const authLimiter = rateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });
