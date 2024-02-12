import _ from 'lodash';
import { PaymentMethodRepository } from './repository';
import { NewPaymentMethod, PaymentMethod } from '../../../db/schema/payment-method';
import { PaymentMethodAlreadyExistException } from '../../../exceptions/bad-request.exception';

export class PaymentMethodService {
  private readonly repository: PaymentMethodRepository;

  constructor() {
    this.repository = new PaymentMethodRepository();
  }

  // * read
  list = async (code?: string) => this.repository.getPaymentMethodsList(code);
  getAll = async () => this.repository.getPaymentMethods();
  // * get one
  getOne = async (code: string) => this.repository.getPaymentMethodByCode(code);
  // * create
  create = async (newPaymentMethod: NewPaymentMethod) => {
    try {
      const existingPaymentMethod = await this.repository.getPaymentMethodByCode(
        newPaymentMethod.code,
      );

      if (!_.isEmpty(existingPaymentMethod)) {
        throw new PaymentMethodAlreadyExistException(newPaymentMethod.code);
      }

      return this.repository.createPaymentMethod(newPaymentMethod);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (updatePaymentMethod: PaymentMethod, code: string) =>
    this.repository.updatePaymentMethod(updatePaymentMethod, code);
  // * delete
  delete = async (code: string) => {
    try {
      await this.repository.deletePaymentMethod(code);
    } catch (error) {
      throw error;
    }
  };
}
