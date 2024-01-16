import _ from 'lodash';
import db from '../../db';
import { DateTime } from 'luxon';
import { rules } from '../../db/schema/rules';
import { NodeType } from '../../types/commons';
import { and, desc, eq, ilike, inArray, like, sql } from 'drizzle-orm';
import { RulesRequest } from '../../types/interfaces';
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
  voucherLists = async (code?: string) => {
    if (!code) {
      return db
        .select(column)
        .from(vouchers)
        .orderBy(desc(vouchers.isActive), desc(vouchers.activeFrom), desc(vouchers.activeTo));
    }

    return db
      .select(column)
      .from(vouchers)
      .where(ilike(vouchers.code, `%${code}%`))
      .orderBy(desc(vouchers.isActive), desc(vouchers.activeFrom), desc(vouchers.activeTo));
  };

  getVouchers = async () => {
    const getVouchersData = await db
      .select()
      .from(vouchers)
      .where(
        and(
          sql`now() between ${vouchers.activeFrom} and ${vouchers.activeTo}`,
          eq(vouchers.isActive, true),
        ),
      );

    // * if vouchers empty, return emtpy object
    if (_.isEmpty(getVouchersData)) {
      return [];
    }

    const getRulesData = await db
      .select()
      .from(rules)
      .where(
        and(
          eq(rules.nodeType, NodeType.VOUCHER),
          inArray(rules.nodeId, _.map(getVouchersData, 'id')),
        ),
      );

    const groupedRules = _.groupBy(getRulesData, 'nodeId');

    return _.map(getVouchersData, (voucher) => ({
      ...voucher,
      rules: groupedRules[voucher.id] || [],
    }));
  };

  getVouchersForSession = async () => {
    const getVouchersData = await db.select().from(vouchers).where(eq(vouchers.isActive, true));

    // * if vouchers empty, return emtpy object
    if (_.isEmpty(getVouchersData)) {
      return [[], []];
    }

    const getRulesData = await db
      .select()
      .from(rules)
      .where(
        and(
          eq(rules.nodeType, NodeType.VOUCHER),
          inArray(rules.nodeId, _.map(getVouchersData, 'id')),
        ),
      );

    const currentDate = DateTime.now();

    const groupedRules = _.groupBy(getRulesData, 'nodeId');

    const voucherWithRules = _.map(getVouchersData, (voucher) => ({
      ...voucher,
      rules: groupedRules[voucher.id] || [],
    }));

    return _.partition(voucherWithRules, (voucher) => {
      const activeFromDate = DateTime.fromSQL(voucher.activeFrom);
      const activeToDate = DateTime.fromSQL(voucher.activeTo);

      return voucher.quota > 0 && currentDate >= activeFromDate && currentDate <= activeToDate;
    });
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
      .where(and(eq(rules.nodeType, NodeType.VOUCHER), eq(rules.nodeId, getVoucher.id)));

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
          .where(and(eq(rules.nodeType, NodeType.VOUCHER), eq(rules.nodeId, updatedVoucher.id)));

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
