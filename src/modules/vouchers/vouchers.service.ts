import _ from 'lodash';
import { VoucherWithRules } from '../../types/interfaces';
import { VoucherRepository } from './vouchers.repository';
import { VoucherAlreadyExistException } from '../../exceptions/bad-request.exception';

export class VoucherService {
  private readonly repository: VoucherRepository;

  constructor() {
    this.repository = new VoucherRepository();
  }

  // * read
  getAll = async () => this.repository.getVouchers();
  // * get one
  getOne = async (code: string) => this.repository.getVoucherByCode(code);
  // * create
  create = async (voucher: VoucherWithRules) => {
    try {
      const existingVoucher = await this.repository.getVoucherByCode(voucher.code);

      if (!_.isEmpty(existingVoucher)) {
        throw new VoucherAlreadyExistException(voucher.code);
      }

      const { rules, ...rest } = voucher;

      return this.repository.createVoucher(rest, rules);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (voucher: VoucherWithRules, code: string) => {
    try {
      const { rules, id, isActive, ...rest } = voucher;

      await this.repository.updateVoucher({ id: id!, isActive: isActive!, ...rest }, rules, code);
    } catch (error) {
      throw error;
    }
  };
  // * delete
  delete = async (code: string) => {
    try {
      await this.repository.softDeleteVoucher(code);
    } catch (error) {
      throw error;
    }
  };
}
