/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
import { logger } from '../utils/logger';

const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  logger.error(error.stack);

  res.status(status).json({
    success: false,
    status,
    message,
  });
};

export default errorMiddleware;
