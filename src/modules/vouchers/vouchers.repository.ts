import _ from 'lodash';
import db from '../../db';
import { and, eq, inArray } from 'drizzle-orm';
import { RulesRequest } from '../../interfaces';
import { NODETYPE, rules } from '../../db/schema/rules';
import { NewVoucher, Voucher, vouchers } from '../../db/schema/voucher';

// * selected & returned column
const column = {
  code: vouchers.code,
  tnc: vouchers.tnc,
  activeFrom: vouchers.activeFrom,
  activeTo: vouchers.activeTo,
  quota: vouchers.quota,
  effect: vouchers.effect,
  type: vouchers.type,
  value: vouchers.value,
  maxValue: vouchers.maxValue,
  isActive: vouchers.isActive,
};

export class VoucherRepository {
  getVouchers = async () => {
    const getVouchersData = await db.select().from(vouchers).where(eq(vouchers.isActive, true));

    const getRulesData = await db
      .select()
      .from(rules)
      .where(
        and(
          eq(rules.nodeType, NODETYPE.VOUCHER),
          inArray(rules.nodeId, _.map(getVouchersData, 'id')),
        ),
      );

    const groupedRules = _.groupBy(getRulesData, 'nodeId');

    return _.map(getVouchersData, (voucher) => ({
      ...voucher,
      rules: groupedRules[voucher.id] || [],
    }));
  };

  getVoucherByCode = async (code: string) => {
    const [getVoucher] = await db
      .select()
      .from(vouchers)
      .where(and(eq(vouchers.code, code), eq(vouchers.isActive, true)));

    if (_.isEmpty(getVoucher)) {
      return null;
    }

    const getRules = await db
      .select()
      .from(rules)
      .where(and(eq(rules.nodeType, NODETYPE.VOUCHER), eq(rules.nodeId, getVoucher.id)));

    return {
      ...getVoucher,
      rules: getRules,
    };
  };

  createVoucher = async (voucher: NewVoucher, newRules: RulesRequest[]) => {
    try {
      return await db.transaction(async (tx) => {
        const [newVoucher] = await tx
          .insert(vouchers)
          .values(voucher)
          .returning({ id: vouchers.id, ...column });

        // * insert the rules to rule table
        const promisesRules = newRules.map((rule) => {
          const { nodeType, key, operatorFn, type, value } = rule;
          return tx
            .insert(rules)
            .values({ nodeType, nodeId: newVoucher.id, key, operatorFn, type, value })
            .returning({
              nodeType: rules.nodeType,
              nodeId: rules.nodeId,
              key: rules.key,
              operatorFn: rules.operatorFn,
              type: rules.type,
              value: rules.value,
            });
        });

        const insertedRules = await Promise.all(promisesRules);

        return {
          ...newVoucher,
          rules: insertedRules,
        };
      });
    } catch (error) {
      throw error;
    }
  };
  updateVoucher = async (voucher: Voucher, newRules: RulesRequest[], code: string) => {
    try {
      return await db.transaction(async (tx) => {
        const [updatedVoucher] = await tx
          .update(vouchers)
          .set(voucher)
          .where(eq(vouchers.code, code))
          .returning({ id: vouchers.id, ...column });

        // * delete all existing rules
        await tx
          .delete(rules)
          .where(and(eq(rules.nodeType, NODETYPE.VOUCHER), eq(rules.nodeId, updatedVoucher.id)));

        // * insert new rules
        const promisesRules = newRules.map((rule) => {
          const { nodeType, key, operatorFn, type, value } = rule;
          return tx
            .insert(rules)
            .values({ nodeType, nodeId: updatedVoucher.id, key, operatorFn, type, value })
            .returning({
              nodeType: rules.nodeType,
              nodeId: rules.nodeId,
              key: rules.key,
              operatorFn: rules.operatorFn,
              type: rules.type,
              value: rules.value,
            });
        });

        const insertedRules = await Promise.all(promisesRules);

        return {
          ...updatedVoucher,
          rules: insertedRules,
        };
      });
    } catch (error) {
      throw error;
    }
  };
  softDeleteVoucher = async (code: string) =>
    db.update(vouchers).set({ isActive: false }).where(eq(vouchers.code, code));
}
