import { Request, Response, NextFunction } from "express";
import { HttpError } from "express-openapi-validator/dist/framework/types";


/**
 * Global error handler middleware.
 * Handles errors and sends proper JSON responses with status codes and error messages.
 * @param {HttpError} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    void next;
    if (err.status && err.errors) {
      console.log("err", err);
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    } else {
      res.status(500).json({
        message: err.message || 'Internal Server Error',
      });
    }
};