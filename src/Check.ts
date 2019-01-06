import { RulesDefinition } from './firebase-database-rules';

export class Check<T> {

    private _chain: string[];

    constructor(public chain?: string[]) {
        this._chain = chain || [];
    }

    get add() {
        this._chain.push(' + ');
        return this;
    }

    get subtract() {
        this._chain.push(' - ');
        return this;
    }

    get negate() {
        this._chain.push('-');
        return this;
    }

    get not() {
        this._chain.push('!');
        return this;
    }

    get and() {
        this._chain.push('&&');
        return this;
    }

    private addBinaryOperation(expression: any, result: any, operator: string) {
        this._chain.push(expression);
        this._chain.push(operator);
        this._chain.push(result);
        return this;
    }

    equal(expression: any, result: any) {
        if (typeof result === 'string') {
            result = `'${result}'`;
        }
        return this.addBinaryOperation(expression, result, '===');
    }

    unequal(expression: any, result: any) {
        if (typeof result === 'string') {
            result = `'${result}'`;
        }
        return this.addBinaryOperation(expression, result, '!==');
    }

    greaterThan(expression: any, result: number) {
        return this.addBinaryOperation(expression, result, '>');
    }

    greaterThanOrEqualTo(expression: any, result: number) {
        return this.addBinaryOperation(expression, result, '>=');
    }

    lessThan(expression: any, result: number) {
        return this.addBinaryOperation(expression, result, '<');
    }

    lessThanOrEqualTo(expression: any, result: number) {
        return this.addBinaryOperation(expression, result, '<=');
    }

    condition(expression: any) {
        this._chain.push(expression);
        return this;
    }

    scope(expression: any) {
        this._chain.push('(');
        this._chain.push(expression);
        this._chain.push(')');
        return this;
    }

    toString() {
        return this._chain.map(item => '' + item).join('');
    }

}

export function check() {
    return new Check();
}
