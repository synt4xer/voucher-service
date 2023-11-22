import expressWinston from "express-winston";
import winston from "winston";

const logFormat = (nfo: winston.Logform.TransformableInfo) => {
  const { timestamp, level, message, ...args } = nfo;
  return `${timestamp} - ${level}: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, null, "") : ""
  }`;
};

// HTTP logger for logging HTTP requests
export const httpLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    /* new winston.transports.File({ filename: 'http.log' }), */
  ],
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    winston.format.json(),
    winston.format.printf(logFormat)
  ),
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
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
    winston.format.simple(),
    winston.format.printf(logFormat)
  ),
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
