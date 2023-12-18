import { body } from 'express-validator';
import validatorMiddleware from '../../middlewares/validator.middleware';

export const sessionValidation = () => [
  body('carts').exists().isArray({ min: 0 }).withMessage('carts should be an array'),
  body('attributes').optional(),
  body('vouchers').optional(),
  validatorMiddleware,
];

export const orderValidation = () => [
  body('carts').exists().isArray().withMessage('carts should be an array'),
  body('carts.*.productId').exists().isInt().withMessage('productId must be number'),
  body('carts.*.productCategoryId')
    .exists()
    .isInt()
    .withMessage('productCategoryId must be number'),
  body('carts.*.qty').exists().isInt().withMessage('qty must be number'),
  body('carts.*.price').exists().isInt().withMessage('price must be number'),
  body('attributes.shipmentCode').exists().isString().withMessage('shipmentCode must be provided'),
  body('attributes.shipmentAmount')
    .exists()
    .isNumeric()
    .withMessage('shipmentAmount must be provided'),
  body('attributes.paymentMethodCode')
    .exists()
    .isString()
    .withMessage('paymentMethodCode must be provided'),
  body('vouchers').exists().isObject().withMessage('vouchers must be provided'),
  body('vouchers.applied').exists().isArray(),
  body('vouchers.available').exists().isArray(),
  body('vouchers.unavailable').exists().isArray(),
  validatorMiddleware,
];
