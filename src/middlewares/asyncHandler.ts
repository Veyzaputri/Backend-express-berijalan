import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: RequestHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // pastikan selalu throw instance Error
      if (!(err instanceof Error)) {
        next(new Error(err?.message || "Unexpected Error"));
      } else {
        next(err);
      }
    });
  };
