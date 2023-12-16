import { logger } from '../utils/logger';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../types/commons';
import { validationResult } from 'express-validator';
import { ParseValidatorResult, ParsedError, ParsedResult } from '../types/interfaces';
import _ from 'lodash';

const validatorMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const vld = parseValidator(errors.array());

  const message = typeof vld.messages == 'string' ? vld.messages : 'something went wrong';

  const stack = _.get(vld.result, 'body[0].messages');

  logger.error(`Error on Validation: ${message}`);

  return res.status(400).json({
    success: false,
    status: 400,
    message,
    stack,
  });
};

function parseValidator(errors: any[]): ParseValidatorResult {
  const result: ParsedResult = {};
  const transform: ParsedError = {};

  errors.forEach((value) => {
    if (!transform[value.location]) {
      transform[value.location] = {};
    }

    if (!transform[value.location][value.param]) {
      transform[value.location][value.param] = [];
    }

    const msgValue = value.msg.replace('?', value.param);

    transform[value.location][value.param].push(`${msgValue} on ${value.path}`);
  });

  // Transform result to array message
  const message: string[] = [];
  for (const key in transform) {
    if (transform.hasOwnProperty(key)) {
      result[key] = Object.keys(transform[key]).map((k) => ({
        param: k,
        messages: _.uniq(transform[key][k]),
      }));

      message.push(key);
    }
  }

  const messages =
    message.length > 0 ? `Invalid request on ${message.join(', ')}` : 'Invalid request!';

  return { result, messages };
}

export default validatorMiddleware;
