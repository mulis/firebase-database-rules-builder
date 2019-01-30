import {
    Token,
    Operators,
    Expression
} from './Operation';

export type CheckInput = Expression | Token;

export class Check {

    private _chain: CheckInput[];

    constructor(chain?: CheckInput[]) {
        this._chain = chain || [];
    }

    private push(...input: CheckInput[]) {
        this._chain.push(...input);
        return this;
    }

    condition(expression: Expression) {
        return this.push(expression);
    }

    get and() {
        return this.push(Operators.and);
    }

    get or() {
        return this.push(Operators.or);
    }

    get not() {
        return this.push(Operators.not);
    }

    equal(left: Expression, right: Expression) {
        return this.push(left, Operators.equal, right);
    }

    unequal(left: Expression, right: Expression) {
        return this.push(left, Operators.unequal, right);
    }

    greaterThan(left: Expression, right: number) {
        return this.push(left, Operators.greaterThan, right);
    }

    greaterThanOrEqualTo(left: Expression, right: number) {
        return this.push(left, Operators.greaterThanOrEqualTo, right);
    }

    lessThan(left: Expression, right: number) {
        return this.push(left, Operators.lessThan, right);
    }

    lessThanOrEqualTo(left: Expression, right: number) {
        return this.push(left, Operators.lessThanOrEqualTo, right);
    }

    ternary(condition: Expression, truthy: Expression, falsy: Expression) {
        return this.push(condition, Operators.ternaryQuestion, truthy, Operators.ternaryColon, falsy);
    }

    toString() {
        return this._chain
            .map(v => typeof v === 'string' ? `'${v}'` : '' + v)
            .join('');
    }

}

export function check() {
    return new Check();
}
