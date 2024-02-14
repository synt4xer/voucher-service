import _ from 'lodash';
import {
  CartAttr,
  CustomerSession,
  EffectAttr,
  SessionState,
  VoucherAttr,
  VoucherListAttr,
} from '../../types/sessions';
import baseUtil from '../../utils/base.util';
import { OrderRepository } from './orders.repository';
import { SessionRepository } from '../core/sessions/repository';
import { VoucherRepository } from '../vouchers/vouchers.repository';
import { ProductRepository } from '../products/products/repository';
import { ShipmentsRepository } from '../shipments/shipments.repository';
import { PaymentMethodRepository } from '../payments/method/repository';
import { EffectType, RuleOperator, ShipmentData, VoucherData } from '../../types/commons';

export class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly voucherRepository: VoucherRepository;
  private readonly sessionRepository: SessionRepository;
  private readonly shipmentsRepository: ShipmentsRepository;
  private readonly paymentMethodRepository: PaymentMethodRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.voucherRepository = new VoucherRepository();
    this.sessionRepository = new SessionRepository();
    this.shipmentsRepository = new ShipmentsRepository();
    this.paymentMethodRepository = new PaymentMethodRepository();
  }

  list = async () => this.orderRepository.allOrders();

  getAll = async (userId: number) => this.orderRepository.getOrders(userId);

  getOne = async (orderId: number) => this.orderRepository.getOrderDetail(orderId);

  doSession = async (customerSession: CustomerSession): Promise<CustomerSession> => {
    try {
      // * this function get all data from customer session, extract some needed attributes,
      // * and get all available voucher, shipment, and payment method if code exists.
      const {
        userId,
        reqCarts,
        reqAttrs,
        reqVouchers,
        reqSessionId,
        fetchVouchers,
        shipment,
        paymentMethod,
        shipmentCode,
        paymentMethodCode,
      } = await this.extractCustomerSession(customerSession);

      const [availVoucher, unavailVoucher] = fetchVouchers;

      // * if carts is empty
      if (_.isEmpty(reqCarts)) {
        const available: VoucherAttr[] = !_.isEmpty(availVoucher)
          ? availVoucher.map(({ code, tnc }) => ({
              voucherCode: code,
              tnc,
            }))
          : [];

        const unavailable: VoucherAttr[] = !_.isEmpty(unavailVoucher)
          ? unavailVoucher.map(({ code, tnc }) => ({
              voucherCode: code,
              tnc,
            }))
          : [];

        return {
          userId,
          state: SessionState.OPEN,
          carts: [],
          attributes: {},
          vouchers: {
            applied: [],
            available,
            unavailable,
          },
        };
      }

      // * get attributes from the request
      const attributes = { ...reqAttrs };

      // * setup payment method
      const paymentMethodName = _.isEmpty(paymentMethod) ? undefined : paymentMethod[0].name;

      // * validating vouchers, chain forwarding algorithm working here
      const [vouchers, effects] = await this.doValidateVoucher(
        { carts: reqCarts, attributes, vouchers: reqVouchers },
        { availVoucher, unavailVoucher },
      );

      // * calculation
      const calculation = await this.doCalculate(reqCarts, shipment, effects);

      // * assign calculated amount to attributes
      _.assign(attributes, {
        ...calculation,
        shipmentCode,
        paymentMethodCode,
        paymentMethodName,
      });

      // * define data for session
      const data = {
        sessionId: reqSessionId,
        userId,
        state: SessionState.OPEN,
        carts: reqCarts,
        attributes,
        vouchers,
        effects,
      };

      // * insert if new, update if exist
      const newSessions = await this.sessionRepository.upsertSession(data);

      return {
        ...data,
        sessionId: newSessions[0].sessionId,
      };
    } catch (error) {
      throw error;
    }
  };

  doCheckout = async (customerSession: CustomerSession) => {
    try {
      // * this function get all data from customer session, extract some needed attributes,
      // * and get all available voucher, shipment, and payment method if code exists.
      const {
        userId,
        reqCarts,
        reqAttrs,
        reqVouchers,
        reqSessionId,
        fetchVouchers,
        shipment,
        paymentMethod,
        shipmentCode,
        paymentMethodCode,
      } = await this.extractCustomerSession(customerSession);

      const [availVoucher, unavailVoucher] = fetchVouchers;

      // * checking carts with current product condition
      const { carts, productMeta } = await this.doValidateCarts(reqCarts);

      // * get attributes from the request
      const attributes = { ...reqAttrs };

      // * setup payment method
      const paymentMethodName = paymentMethod[0].name;

      // * validating vouchers, chain forwarding algorithm working here
      const [vouchers, effects] = await this.doValidateVoucher(
        { carts, attributes, vouchers: reqVouchers },
        { availVoucher, unavailVoucher },
      );

      // * calculation
      const calculation = await this.doCalculate(carts, shipment, effects);

      // * assign calculated amount to attributes
      _.assign(attributes, {
        ...calculation,
        shipmentCode,
        paymentMethodCode,
        paymentMethodName,
      });

      // * define data for checking out the cart
      const data = {
        sessionId: reqSessionId,
        userId,
        state: SessionState.CLOSED,
        carts,
        attributes,
        vouchers,
        effects,
      };

      // * saving data for session, order detail, and order
      await this.orderRepository.doOrder(data, productMeta);
    } catch (error) {
      throw error;
    }
  };

  private doValidateVoucher = async (
    data: { carts: CartAttr[]; attributes: Record<string, any>; vouchers: VoucherListAttr },
    dbVouchers: { availVoucher: VoucherData[]; unavailVoucher: VoucherData[] },
  ): Promise<[vouchers: VoucherListAttr, effects: EffectAttr[]]> => {
    const effects: EffectAttr[] = [];

    const carts = _.get(data, 'carts');
    const attributes = _.get(data, 'attributes');
    const reqApplied: VoucherAttr[] = _.get(data, 'vouchers.applied', []);
    const reqAvailable: VoucherAttr[] = _.get(data, 'vouchers.available', []);
    const reqUnavailable: VoucherAttr[] = _.get(data, 'vouchers.unavailable', []);
    const availVoucher = _.get(dbVouchers, 'availVoucher');
    const unavailVoucher = _.get(dbVouchers, 'unavailVoucher');

    // * return early if there is no avail vouchers
    if (_.isEmpty(availVoucher) && _.isEmpty(unavailVoucher)) {
      return [
        {
          applied: [],
          available: [],
          unavailable: [],
        },
        [],
      ];
    }

    // * flat the rules on voucher and add the voucherCode inside of it
    const flattenedRules = _.chain(availVoucher)
      .flatMap((voucher) =>
        voucher.rules.map((rule) => ({
          ...rule,
          voucherCode: voucher.code,
          tnc: voucher.tnc,
          effect: voucher.effect,
          effectValue: voucher.value,
          effectValueType: voucher.type,
          effectMaxValue: voucher.maxValue,
        })),
      )
      .value();

    // * make a dictionary rules based on voucherCode
    const rulesByVoucherCode = _.groupBy(flattenedRules, 'voucherCode');

    // * forward chaining algorithm
    for (const voucherCode in rulesByVoucherCode) {
      const rulesForVoucher = rulesByVoucherCode[voucherCode] || [];

      // * check if voucher are applicable
      const isVoucherApplicable = rulesForVoucher.every((rule) => {
        if (rule.key.startsWith('attributes.') && _.isNull(attributes)) {
          return false;
        }

        const payloadValue = rule.key.startsWith('attributes.')
          ? attributes[rule.key.split('.')[1]]
          : _.map(carts, (cart) => _.get(cart, rule.key.split('.')[1]));

        const operatorFn = _.isArray(payloadValue)
          ? RuleOperator.EV
          : baseUtil.stringToEnum(RuleOperator, rule.operatorFn);

        return baseUtil.checkCondition(operatorFn!, payloadValue, rule.value, rule.type);
      });

      // * Find the voucher in applied, available, and unavailable by voucherCode
      const voucherInApplied = _.find(reqApplied, { voucherCode });
      const voucherInAvailable = _.find(reqAvailable, { voucherCode: voucherCode });
      const voucherInUnavailable = _.find(reqUnavailable, { voucherCode: voucherCode });

      if (isVoucherApplicable) {
        if (voucherInApplied) {
          const effectType = baseUtil.stringToEnum(EffectType, rulesForVoucher[0].effect);
          const valueType = rulesForVoucher[0].effectValueType;
          const effectValue = rulesForVoucher[0].effectValue;
          const maxValue = rulesForVoucher[0].effectMaxValue;
          const total = _.get(attributes, 'total', 0);
          const shipmentAmount = _.get(attributes, 'shipmentAmount', 0);
          let value = 0;

          if (effectType == EffectType.SET_DISCOUNT) {
            if (valueType == 'percentage') {
              const amount = (+effectValue * total) / 100;
              value = Math.min(amount, +maxValue);
            } else {
              // * type nominal
              value = +effectValue;
            }
          } else {
            if (valueType == 'percentage') {
              const amount = (+effectValue * shipmentAmount) / 100;
              value = Math.min(amount, +maxValue);
            } else {
              // * type nominal
              value = +effectValue;
            }
          }

          effects.push({
            voucherCode,
            effectType: effectType!,
            value,
          });
        } else if (!voucherInAvailable) {
          reqAvailable.push({ voucherCode, tnc: rulesForVoucher[0].tnc });
        }
      } else {
        if (voucherInApplied) {
          _.remove(reqApplied, { voucherCode });
        }

        if (voucherInAvailable) {
          _.remove(reqAvailable, { voucherCode });
        }

        if (!voucherInUnavailable) {
          reqUnavailable.push({ voucherCode, tnc: rulesForVoucher[0].tnc });
        }
      }
    }

    // * data cleansing
    const unavailable = _.chain(unavailVoucher)
      .map(({ code, tnc }) => ({
        voucherCode: code,
        tnc,
      }))
      .unionBy(reqUnavailable, 'voucherCode')
      .value();
    const available = _.uniqBy(reqAvailable, 'voucherCode');
    const applied = _.chain(reqApplied)
      .differenceWith(unavailable, (apply, unavail) => apply.voucherCode === unavail.voucherCode)
      .uniqBy('voucherCode')
      .value();
    // const available = _.chain(reqAvailable)
    //   .differenceWith(unavailable, (avail, unavail) => avail.voucherCode === unavail.voucherCode)
    //   .uniqBy('voucherCode')
    //   .value();

    return [
      {
        applied,
        available,
        unavailable,
      },
      effects,
    ];
  };

  private doCalculate = async (
    carts: CartAttr[],
    shipment: ShipmentData[],
    effects: EffectAttr[],
  ) => {
    // * total
    const cartTotal = carts
      .map((item) => item.qty * item.price)
      .reduce((total, itemTotal) => total + itemTotal, 0);

    // * discount
    const discount = effects
      .filter((item) => item.effectType === EffectType.SET_DISCOUNT)
      .map((item) => item.value)
      .reduce((total, discountTotal) => total + discountTotal, 0);

    // * shipment amount
    const shipmentAmount = _.isEmpty(shipment) ? undefined : +shipment[0].amount;

    // * shipment discount
    const shipmentDiscount = effects
      .filter((item) => item.effectType === EffectType.SET_SHIPPING_DISCOUNT)
      .map((item) => item.value)
      .reduce((total, shippingDiscountTotal) => total + shippingDiscountTotal, 0);

    // * validating shipping amount with shipping discount
    const validShippingAmount = Math.max(0, (shipmentAmount ?? 0) - shipmentDiscount);

    // * grand total
    const grandTotal = Math.max(0, cartTotal - discount + validShippingAmount);

    return {
      total: cartTotal,
      discount,
      shipmentDiscount,
      shipmentAmount,
      grandTotal,
    };
  };

  private extractCustomerSession = async (customerSession: CustomerSession) => {
    // * get payload data from customer session
    const userId = _.get(customerSession, 'userId');
    const reqCarts = _.get(customerSession, 'carts');
    const reqAttrs = _.get(customerSession, 'attributes');
    const reqVouchers = _.get(customerSession, 'vouchers');
    const reqSessionId = _.get(customerSession, 'sessionId');

    // * get some needed attributes
    const shipmentCode = _.get(reqAttrs, 'shipmentCode', null);
    const paymentMethodCode = _.get(reqAttrs, 'paymentMethodCode', null);

    // * get all available voucher, shipment, and payment method if code exists
    const [fetchVouchers, shipment, paymentMethod] = await Promise.all([
      this.voucherRepository.getVouchersForSession(),
      _.isNull(shipmentCode) ? [] : this.shipmentsRepository.getShipmentByCode(shipmentCode),
      _.isNull(paymentMethodCode)
        ? []
        : this.paymentMethodRepository.getPaymentMethodByCode(paymentMethodCode),
    ]);

    return {
      userId,
      reqCarts,
      reqAttrs,
      reqVouchers,
      reqSessionId,
      fetchVouchers,
      shipment,
      paymentMethod,
      shipmentCode,
      paymentMethodCode,
    };
  };

  private async doValidateCarts(reqCarts: CartAttr[]) {
    try {
      const ids = _.map(reqCarts, 'productId');
      const dbProducts = await this.productRepository.getProductByIds(ids);

      // * return the latest information of products
      const carts = _.map(dbProducts, (obj) => {
        const obj1 = _.find(reqCarts, { productId: obj.id });

        return {
          productId: obj.id,
          productCategoryId: obj.productCategoryId,
          productName: obj.name,
          price: +obj.price,
          qty: obj1 ? obj1.qty : 0,
        };
      });

      return { carts, productMeta: dbProducts };
    } catch (error) {
      throw error;
    }
  }
}
