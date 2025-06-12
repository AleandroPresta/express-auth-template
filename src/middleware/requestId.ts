/**
 * Request ID middleware
 * Adds unique request ID to each request for tracking
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
    const id = uuidv4();
    res.locals['requestId'] = id;
    res.setHeader('X-Request-ID', id);
    next();
};
