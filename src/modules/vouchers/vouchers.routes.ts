import express from 'express';
import VoucherController from './vouchers.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = express.Router();
const voucherController = new VoucherController();

router.get('/list', authMiddleware, voucherController.list);
router.get('/', authMiddleware, voucherController.getAll);
router.post('/', authMiddleware, voucherController.create);
router.get('/:code', authMiddleware, voucherController.getOne);
router.patch('/:code', authMiddleware, voucherController.update);
router.delete('/:code', authMiddleware, voucherController.delete);

export default router;
