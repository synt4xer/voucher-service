import _ from 'lodash';
import db from '../../db';
import { DateTime } from 'luxon';
import { eq, inArray, sql } from 'drizzle-orm';
import { ProductData } from '../../types/commons';
import { sessions } from '../../db/schema/session';
import { shipment } from '../../db/schema/shipment';
import { NewOrder, orders } from '../../db/schema/order';
import { NewOrderDetail, orderDetails } from '../../db/schema/order-detail';
import { paymentMethod } from '../../db/schema/payment-method';
import { vouchers as voucherSchema } from '../../db/schema/voucher';
import { inventoryDetails } from '../../db/schema/inventory-detail';
import { CartAttr, EffectAttr, VoucherListAttr } from '../../types/sessions';
import { inventories } from '../../db/schema/inventory';
import { StockInsufficientException } from '../../exceptions/bad-request.exception';

export class OrderRepository {
  getOrders = async (userId: number) => {
    const orderData = await db.select().from(orders).where(eq(orders.userId, userId));

    if (_.isEmpty(orderData)) {
      return [];
    }

    const getOrderDetail = await db
      .select()
      .from(orderDetails)
      .where(inArray(orderDetails.orderId, _.map(orderData, 'id')));

    const groupedDetail = _.groupBy(getOrderDetail, 'orderId');

    return _.map(orderData, (order) => ({
      ...order,
      details: groupedDetail[order.id] || [],
    }));
  };
  getOrderDetail = async (orderId: number) => {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

    if (_.isEmpty(order)) {
      return null;
    }

    const getDetail = await db.select().from(orderDetails).where(eq(orderDetails.orderId, orderId));

    return {
      ...order,
      details: getDetail,
    };
  };
  doOrder = (
    data: {
      userId: number;
      sessionId: string | undefined;
      state?: string | undefined;
      carts: CartAttr[];
      attributes: Record<string, any>;
      vouchers: VoucherListAttr;
      effects: EffectAttr[];
    },
    productMeta: ProductData[],
  ) => {
    const { userId, sessionId, state, carts, attributes, vouchers, effects } = data;
    const {
      total,
      discount,
      shipmentDiscount,
      shipmentAmount,
      grandTotal,
      shipmentCode,
      paymentMethodCode,
    } = attributes;
    const appliedVoucherCodes = _.map(vouchers.applied, 'voucherCode');
    const productIds = _.map(carts, 'productId');

    return db.transaction(async (tx) => {
      // * set session to closed
      await tx
        .update(sessions)
        .set({ state, userId, data: JSON.stringify(data), updatedAt: DateTime.now().toString() })
        .where(eq(sessions.sessionId, sessionId!));

      // * get latest metadata for shipment, payment, and vouhcer
      const [shipmentMeta, paymentMeta, voucherMeta, inventoryData] = await Promise.all([
        tx.select().from(shipment).where(eq(shipment.code, attributes.shipmentCode)),
        tx.select().from(paymentMethod).where(eq(paymentMethod.code, attributes.paymentMethodCode)),
        tx.select().from(voucherSchema).where(inArray(voucherSchema.code, appliedVoucherCodes)),
        tx
          .select({
            inventoryId: inventories.id,
            productId: inventories.productId,
            qtyAvail: inventories.qtyAvail,
          })
          .from(inventories)
          .where(inArray(inventories.productId, productIds)),
      ]);

      const isQuantityAvail = _.every(inventoryData, (data) => data.qtyAvail > 0);

      if (!isQuantityAvail) {
        tx.rollback();
        throw new StockInsufficientException();
      }

      // * set data order header
      const newOrder: NewOrder = {
        userId,
        total,
        shipmentCode,
        paymentCode: paymentMethodCode,
        discount,
        shipmentDiscount,
        shipmentAmount,
        grandTotal,
        voucherMeta: _.thru(voucherMeta, (data) => JSON.stringify(data)),
        paymentMeta: _.thru(paymentMeta, (data) => JSON.stringify(data)),
        shipmentMeta: _.thru(shipmentMeta, (data) => JSON.stringify(data)),
      };

      const order = await tx.insert(orders).values(newOrder).returning({ id: orders.id });

      const newOrderDetails: NewOrderDetail[] = _.map(carts, (cart) => {
        const total = String(cart.price * cart.qty);

        return {
          total: total,
          orderId: order[0].id,
          price: cart.price.toString(),
          productId: cart.productId,
          qty: cart.qty,
          productMeta: _.chain(productMeta)
            .find((obj) => obj.id === cart.productId)
            .thru((data) => JSON.stringify(data))
            .value(),
        };
      });

      const orderDetailsData = await tx
        .insert(orderDetails)
        .values(newOrderDetails)
        .returning({ orderDetailId: orderDetails.id, productId: orderDetails.productId });

      const newInventoryDetails = _.map(carts, (cart) => {
        return {
          inventoryId: _.chain(inventoryData)
            .find({ productId: cart.productId })
            .get('inventoryId')
            .value(),
          orderDetailId: _.chain(orderDetailsData)
            .find({ productId: cart.productId })
            .get('orderDetailId')
            .value(),
          orderMeta: _.thru(newOrder, (data) => JSON.stringify(data)),
        };
      });

      await tx.insert(inventoryDetails).values(newInventoryDetails);

      carts.forEach(async (cart) => {
        await tx
          .update(inventories)
          .set({
            qtyAvail: sql`${inventories.qtyAvail} - ${cart.qty}`,
            qtySettled: sql`${inventories.qtySettled} + ${cart.qty}`,
          })
          .where(eq(inventories.productId, cart.productId));
      });

      return true;
    });
  };
}
