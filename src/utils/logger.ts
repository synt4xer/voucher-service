import expressWinston from 'express-winston';
import winston from 'winston';
import { AppConstant } from './app-constant';

const logFormat = (nfo: winston.Logform.TransformableInfo) => {
  const { timestamp, level, message, ...args } = nfo;
  return AppConstant.NODE_ENV == 'production'
    ? `${timestamp} - ${level}: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`
    : `${timestamp} - ${level}: ${message}`;
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
  winston.format.prettyPrint(),
  winston.format.colorize(),
  winston.format.json(),
  winston.format.printf(logFormat),
);

// HTTP logger for logging HTTP requests
export const httpLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    /* new winston.transports.File({ filename: 'http.log' }), */
  ],
  format,
  meta: true,
  expressFormat: true,
  colorize: true,
});

// Custom logger
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    /* new winston.transports.File({ filename: 'custom.log' }), */
  ],
  format,
});

// Example of using the custom logger
/* logger.debug('This is a debug message.');
  logger.log('info', 'This is an info message.');
  logger.info('This is another info message.'); */

// Example with additional metadata
/* const userId = 123;
  logger.info('User logged in', { userId }); */

// Example of logging errors
/* const error = new Error('This is an error message.');
  logger.error('An error occurred', { error }); */
