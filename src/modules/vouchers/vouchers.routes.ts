import express from 'express';
import VoucherController from './vouchers.controller';

const router = express.Router();
const voucherController = new VoucherController();

router.get('/', voucherController.getAll);
router.post('/', voucherController.create);
router.get('/:code', voucherController.getOne);
router.patch('/:code', voucherController.update);
router.delete('/:code', voucherController.delete);

export default router;
