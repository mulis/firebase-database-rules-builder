import { RuleDataSnapshotValue } from './Context';

declare type Expression = string | RuleDataSnapshotValue;

declare type Operand = null | boolean | number | string | RuleDataSnapshotValue;

declare type CheckInput = Expression | Operand | String;

class Operators {

    static and = new String(' && ');

    static or = new String(' || ');

    static not = new String('!');

    static equal = new String(' === ');

    static unequal = new String(' !== ');

    static greaterThan  = new String(' > ');

    static greaterThanOrEqualTo  = new String(' >= ');

    static lessThan  = new String(' < ');

    static lessThanOrEqualTo  = new String(' <= ');

}

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

    equal(left: Operand, right: Operand) {
        return this.push(left, Operators.equal, right);
    }

    unequal(left: Operand, right: Operand) {
        return this.push(left, Operators.unequal, right);
    }

    greaterThan(left: Operand, right: number) {
        return this.push(left, Operators.greaterThan, right);
    }

    greaterThanOrEqualTo(left: Operand, right: number) {
        return this.push(left, Operators.greaterThanOrEqualTo, right);
    }

    lessThan(left: Operand, right: number) {
        return this.push(left, Operators.lessThan, right);
    }

    lessThanOrEqualTo(left: Operand, right: number) {
        return this.push(left, Operators.lessThanOrEqualTo, right);
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
