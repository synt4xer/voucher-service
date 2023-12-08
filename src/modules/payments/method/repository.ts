import db from '../../../db';
import { and, eq } from 'drizzle-orm';
import { NewPaymentMethod, PaymentMethod, paymentMethod } from '../../../db/schema/payment-method';

export class PaymentMethodRepository {
  getPaymentMethods = async () =>
    db.select().from(paymentMethod).where(eq(paymentMethod.isActive, true));
  getPaymentMethodByCode = async (paymentCode: string) =>
    db
      .select()
      .from(paymentMethod)
      .where(and(eq(paymentMethod.code, paymentCode), eq(paymentMethod.isActive, true)));
  createPaymentMethod = async (createPaymentMethod: NewPaymentMethod) =>
    db
      .insert(paymentMethod)
      .values(createPaymentMethod)
      .returning({ code: paymentMethod.code, name: paymentMethod.name });
  updatePaymentMethod = async (UpdatePaymentMethod: PaymentMethod, code: string) =>
    db
      .update(paymentMethod)
      .set(UpdatePaymentMethod)
      .where(eq(paymentMethod.code, code))
      .returning({ code: paymentMethod.code, name: paymentMethod.name });
  deletePaymentMethod = async (code: string) =>
    db.update(paymentMethod).set({ isActive: false }).where(eq(paymentMethod.code, code));
}
