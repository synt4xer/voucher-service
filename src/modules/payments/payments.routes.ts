import express from 'express';
import PaymentMethodController from './payment-methods.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = express.Router();

const paymentMethodController = new PaymentMethodController();

// * payment method
router.get('/methods', authMiddleware, paymentMethodController.getAll);
router.post('/methods', authMiddleware, paymentMethodController.create);
router.get('/methods/:code', authMiddleware, paymentMethodController.getOne);
router.patch('/methods/:code', authMiddleware, paymentMethodController.update);
router.delete('/methods/:code', authMiddleware, paymentMethodController.delete);

export default router;
