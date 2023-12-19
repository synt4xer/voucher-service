import { body } from 'express-validator';
import validatorMiddleware from '../../middlewares/validator.middleware';

export const loginValidator = () => [
  body('email').exists().isEmail(),
  body('password').exists().isString(),
  validatorMiddleware,
];

export const registerValidator = () => [
  body('name').exists().isString(),
  body('email').exists().isEmail(),
  body('dob').exists(),
  body('address').exists().isString(),
  body('password').exists().isString(),
  body('phone').exists(),
  validatorMiddleware,
];

export const refreshValidator = () => [
  body('refreshToken').exists().isString(),
  validatorMiddleware,
];
