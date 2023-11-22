/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
import winston from 'winston';

const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  winston.error(error.stack);

  res.status(status).send({
    success: false,
    status,
    message,
  });
};

export default errorMiddleware;

//import { NextFunction, Request, Response } from 'express';
//
//import ErrorResponse from './interfaces/ErrorResponse';
//
//export function notFound(req: Request, res: Response, next: NextFunction) {
//  res.status(404);
//  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
//  next(error);
//}
//
//// eslint-disable-next-line @typescript-eslint/no-unused-vars
//export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
//  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
//  res.status(statusCode);
//  res.json({
//    message: err.message,
//    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
//  });
//}
