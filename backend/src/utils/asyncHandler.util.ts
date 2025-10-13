import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// You can use this utility to wrap your async route handlers
// Example usage:
// app.get('/route', asyncHandler(async (req, res, next) => {
//     // your async code here
// })); 

export default asyncHandler;