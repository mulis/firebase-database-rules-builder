import {
    RuleDataSnapshotNullValue,
    RuleDataSnapshotBooleanValue,
    RuleDataSnapshotNumberValue,
    RuleDataSnapshotStringValue
} from './Context';

declare type NullExpression = null | RuleDataSnapshotNullValue | Operation;

declare type BooleanExpression = boolean | RuleDataSnapshotBooleanValue | Operation;

declare type NumberExpression = number | RuleDataSnapshotNumberValue | Operation;

declare type StringExpression = string | RuleDataSnapshotStringValue | Operation;

declare type Expression = NullExpression | BooleanExpression | NumberExpression | StringExpression;

declare type OperationInput = Expression | Operation | String;

class Operators {

    static negate = new String('-');

    static add = new String(' + ');

    static subtract = new String(' - ');

    static multiply = new String(' * ');

    static divide = new String(' / ');

    static modulus  = new String(' % ');

    static ternaryQuestion  = new String(' ? ');

    static ternaryColon  = new String(' : ');

}

class Symbols {

    static parenthesisLeft = new String('(');

    static parenthesisRigth = new String(')');

}

class Operation {

    private _chain: OperationInput[] = [];

    constructor(...input: OperationInput[]) {
        this._chain = [...input];
    }

    toString() {
        return this._chain
            .map(v => typeof v === 'string' ? `'${v}'` : v)
            .join('');
    }
}

export function add(left: NumberExpression | StringExpression, right: NumberExpression | StringExpression) {
    return new Operation(left, Operators.add, right);
}

export function subtract(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.subtract, right);
}

export function multiply(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.multiply, right);
}

export function divide(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.divide, right);
}

export function modulus(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.modulus, right);
}

export function scope(expression: Expression) {
    return new Operation(Symbols.parenthesisLeft, expression, Symbols.parenthesisRigth);
}

export function negate(expression: Expression) {
    return new Operation(Operators.negate, expression);
}

export function ternary(condition: BooleanExpression, truthy: Expression, falsy: Expression) {
    return new Operation(condition, Operators.ternaryQuestion, truthy, Operators.ternaryColon, falsy);
}
