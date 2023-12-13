import _ from 'lodash';
import { RuleOperator } from '../types/commons';

class BaseUtil {
  checkCondition(
    operatorFn: RuleOperator,
    payloadValue: any,
    ruleValue: string,
    valueType: string,
  ) {
    const operators: Record<RuleOperator, (a: any, b: any) => boolean> = {
      [RuleOperator.EQ]: (a, b) => _.isEqual(String(a), String(b)),
      [RuleOperator.GT]: (a, b) => _.gt(Number(a), Number(b)),
      [RuleOperator.GTE]: (a, b) => _.gte(Number(a), Number(b)),
      [RuleOperator.LT]: (a, b) => _.lt(Number(a), Number(b)),
      [RuleOperator.LTE]: (a, b) => _.lte(Number(a), Number(b)),
      [RuleOperator.SM]: (a, b) =>
        _.isArray(a) && _.some((a: any) => this.checkCondition(RuleOperator.EQ, a, b, valueType)),
      [RuleOperator.EV]: (a, b) =>
        _.isArray(a) && _.every((a: any) => this.checkCondition(RuleOperator.EQ, a, b, valueType)),
    };

    const operator = operators[operatorFn];

    if (operator) {
      return operator(payloadValue, ruleValue);
    }

    // * else condition
    return false;
  }
}

export default new BaseUtil();
