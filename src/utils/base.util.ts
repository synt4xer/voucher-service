import _, { values } from 'lodash';
import { RuleOperator } from '../types/commons';

class BaseUtil {
  checkCondition(
    operatorFn: RuleOperator,
    payloadValue: any,
    ruleValue: string,
    valueType: string,
  ) {
    // * define the function based on RuleOperator enum
    const operators: Record<RuleOperator, (a: any, b: any) => boolean> = {
      [RuleOperator.EQ]: (a, b) => _.isEqual(String(a), String(b)),
      [RuleOperator.GT]: (a, b) => _.gt(Number(a), Number(b)),
      [RuleOperator.GTE]: (a, b) => _.gte(Number(a), Number(b)),
      [RuleOperator.LT]: (a, b) => _.lt(Number(a), Number(b)),
      [RuleOperator.LTE]: (a, b) => _.lte(Number(a), Number(b)),
      [RuleOperator.SM]: (a, b) =>
        _.isArray(a) &&
        _.some(a, (value: any) => this.checkCondition(RuleOperator.EQ, value, b, valueType)),
      [RuleOperator.EV]: (a, b) =>
        _.isArray(a) &&
        _.every(a, (value: any) => this.checkCondition(RuleOperator.EQ, value, b, valueType)),
    };

    // * create a function based on operator parameter
    const operator = operators[operatorFn];

    // * if the function created with existed RuleOperator from parameter
    if (operator) {
      return operator(payloadValue, ruleValue);
    }

    // * if RuleOperator from parameter is not exist
    return false;
  }

  stringToEnum<T extends string | number>(
    enumObj: Record<string, T>,
    value: string,
  ): T | undefined {
    const enumValues = Object.values(enumObj);
    if (enumValues.includes(value as T)) {
      return value as T;
    }

    return undefined;
  }
}

export default new BaseUtil();
