import {
    RuleDataSnapshotNullValue,
    RuleDataSnapshotBooleanValue,
    RuleDataSnapshotNumberValue,
    RuleDataSnapshotStringValue
} from './Context';

export type NullExpression = Operation | RuleDataSnapshotNullValue | null;

export type BooleanExpression = Operation | RuleDataSnapshotBooleanValue | boolean;

export type NumberExpression = Operation | RuleDataSnapshotNumberValue | number;

export type StringExpression = Operation | RuleDataSnapshotStringValue | string;

export type Expression = NullExpression | BooleanExpression | NumberExpression | StringExpression;

export class Token extends String { }

export type OperationInput = Expression | Token;

export class Operation {

    private _chain: OperationInput[] = [];

    constructor(...input: OperationInput[]) {
        this._chain = [...input];
    }

    toString() {
        return this._chain
            .map(value => typeof value === 'string' ? `'${value}'` : value)
            .join('');
    }
}

export class Operators {

    static negate = new Token('-');

    static add = new Token(' + ');

    static subtract = new Token(' - ');

    static multiply = new Token(' * ');

    static divide = new Token(' / ');

    static modulus  = new Token(' % ');

    static ternaryQuestion  = new Token(' ? ');

    static ternaryColon  = new Token(' : ');

    static and = new Token(' && ');

    static or = new Token(' || ');

    static not = new Token('!');

    static equal = new Token(' === ');

    static unequal = new Token(' !== ');

    static greaterThan  = new Token(' > ');

    static greaterThanOrEqualTo  = new Token(' >= ');

    static lessThan  = new Token(' < ');

    static lessThanOrEqualTo  = new Token(' <= ');

}

export class Symbols {

    static parenthesisLeft = new Token('(');

    static parenthesisRigth = new Token(')');

}

export function scope(expression: Expression) {
    return new Operation(Symbols.parenthesisLeft, expression, Symbols.parenthesisRigth);
}

export function negate(expression: Expression) {
    return new Operation(Operators.negate, expression);
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

export function ternary(condition: BooleanExpression, truthy: Expression, falsy: Expression) {
    return new Operation(condition, Operators.ternaryQuestion, truthy, Operators.ternaryColon, falsy);
}

export function and(left: BooleanExpression, right: BooleanExpression) {
    return new Operation(left, Operators.and, right);
}

export function or(left: BooleanExpression, right: BooleanExpression) {
    return new Operation(left, Operators.or, right);
}

export function not(right: BooleanExpression) {
    return new Operation(Operators.not, right);
}

export function equal(left: Expression, right: Expression) {
    return new Operation(left, Operators.equal, right);
}

export function unequal(left: Expression, right: Expression) {
    return new Operation(left, Operators.unequal, right);
}

export function greaterThan(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.greaterThan, right);
}

export function greaterThanOrEqualTo(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.greaterThanOrEqualTo, right);
}

export function lessThan(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.lessThan, right);
}

export function lessThanOrEqualTo(left: NumberExpression, right: NumberExpression) {
    return new Operation(left, Operators.lessThanOrEqualTo, right);
}
