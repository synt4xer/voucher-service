import express from 'express';
import OrderController from './orders.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = express.Router();
const controller = new OrderController();

router.post('/session', authMiddleware, controller.session);

export default router;
