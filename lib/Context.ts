import {
    Auth,
    AuthToken,
    RuleVariables,
    RuleDataSnapshot,
    Value,
    NullValue,
    BooleanValue,
    NumberValue,
    StringValue
} from './firebase-database-rules';
import { Token, Operators, Symbols, Expression } from './Operation';
import { PathBuilder } from './PathBuilder';

type ContextType<T> = {
    [ P in keyof T]:
        AuthContext
        | AuthTokenContext
        | RuleDataSnapshotContext
        | RuleDataSnapshotValue
        | ((...args: any[]) => RuleDataSnapshotContext)
        | ((...args: any[]) => RuleDataSnapshotValue)
};

export class Member extends String { }

declare type ContextInput = Context | Member | Token | Expression;

export class Context {

    private chain: ContextInput[];

    constructor(context?: Context) {

        this.chain = [];

        if (context) {
            Context.push(this, context);
        }
    }

    static push(context: Context, input: ContextInput) {
        context.chain.push(input);
    }

    static spawn(context: Context, input: ContextInput) {
        let newContext = new Context(context);
        newContext.chain.push(input);
        return newContext;
    }

    static unwrap(context: Context) {
        let result: ContextInput[] = [];
        context.chain.forEach(value => {
            if (value instanceof Context) {
                result = result.concat(Context.unwrap(value));
            } else {
                result = result.concat(value);
            }
        });
        return result;
    }

    get equal() {
        let context = Context.spawn(this, Operators.equal);
        return new RuleVariablesContext(context);
    }

    get unequal() {
        let context = Context.spawn(this, Operators.unequal);
        return new RuleVariablesContext(context);
    }

    toString() {
        return Context.unwrap(this).reduce<string>((result, value, index, chain) => {
            if (value instanceof Context) {
                result += value.toString();
            } else if (value instanceof Member) {
                let previousIsMember = (chain[index - 1] instanceof Member);
                result += `${ previousIsMember && index > 0 ? '.' : '' }${ value }`;
            } else if (value instanceof Token) {
                result += value.toString();
            } else {
                result += typeof value === 'string' ? `'${value}'` : new String(value);
            }
            return result;
        }, '');
    }

}

export class RuleVariablesContext
    extends Context
    implements ContextType<RuleVariables> {

    // Firebase variables

    get auth() {
        let context = Context.spawn(this, new Member(`auth`));
        return new AuthContext(context);
    }

    get now() {
        Context.push(this, new Member(`now`));
        return new RuleDataSnapshotNumberValue(this);
    }

    get root() {
        let context = Context.spawn(this, new Member(`root`));
        return new RuleDataSnapshotContext(context);
    }

    get data() {
        let context = Context.spawn(this, new Member(`data`));
        return new RuleDataSnapshotContext(context);
    }

    get newData() {
        let context = Context.spawn(this, new Member(`newData`));
        return new RuleDataSnapshotContext(context);
    }

    // Chaining properties and methods

    get not() {
        let context = Context.spawn(this, Operators.not);
        return new RuleVariablesContext(context);
    }

    get negate() {
        let context = Context.spawn(this, Operators.negate);
        return new RuleVariablesContext(context);
    }

    evaluate(expression: Expression) {
        let context = Context.spawn(this, expression);
        return new RuleDataSnapshotValue(context);
    }

    scope(expression: Expression) {
        let context = new Context(this);
        Context.push(context, Symbols.parenthesisLeft);
        Context.push(context, expression);
        Context.push(context, Symbols.parenthesisRigth);
        return new RuleDataSnapshotValue(context);
    }

}

export class AuthContext
    extends Context
    implements ContextType<Auth> {

    get provider() {
        let context = Context.spawn(this, new Member(`provider`));
        return new RuleDataSnapshotStringValue(context);
    }

    get uid() {
        let context = Context.spawn(this, new Member(`uid`));
        return new RuleDataSnapshotStringValue(context);
    }

    get token() {
        let context = Context.spawn(this, new Member(`token`));
        return new AuthTokenContext(context);
    }

}

export class AuthTokenContext
    extends Context
    implements ContextType<AuthToken> {

    get email() {
        Context.push(this, new Member(`email`));
        return new RuleDataSnapshotStringValue(this);
    }

    get email_verified() {
        Context.push(this, new Member(`email_verified`));
        return new RuleDataSnapshotBooleanValue(this);
    }

    get phone_number() {
        Context.push(this, new Member(`phone_number`));
        return new RuleDataSnapshotStringValue(this);
    }

    get name() {
        Context.push(this, new Member(`name`));
        return new RuleDataSnapshotStringValue(this);
    }

    get sub() {
        Context.push(this, new Member(`sub`));
        return new RuleDataSnapshotStringValue(this);
    }

    get 'firebase.identities'() {
        Context.push(this, new Member(`firebase.identities`));
        return new RuleDataSnapshotStringValue(this); // TODO
    }

    get 'firebase.sign_in_provider'() {
        Context.push(this, new Member(`firebase.sign_in_provider`));
        return new RuleDataSnapshotStringValue(this);
    }

    get iss() {
        Context.push(this, new Member(`iss`));
        return new RuleDataSnapshotStringValue(this);
    }

    get aud() {
        Context.push(this, new Member(`aud`));
        return new RuleDataSnapshotStringValue(this);
    }

    get auth_time() {
        Context.push(this, new Member(`auth_time`));
        return new RuleDataSnapshotStringValue(this);
    }

    get iat() {
        Context.push(this, new Member(`iat`));
        return new RuleDataSnapshotStringValue(this);
    }

    get exp() {
        Context.push(this, new Member(`exp`));
        return new RuleDataSnapshotStringValue(this);
    }

}

export class RuleDataSnapshotContext
    extends Context
    implements ContextType<RuleDataSnapshot> {

    val() {
        let context = Context.spawn(this, new Member(`val()`));
        return new RuleDataSnapshotValue(context);
    }

    valString() {
        let context = Context.spawn(this, new Member(`val()`));
        return new RuleDataSnapshotStringValue(context);
    }

    valNumber() {
        let context = Context.spawn(this, new Member(`val()`));
        return new RuleDataSnapshotNumberValue(context);
    }

    valBoolean() {
        let context = Context.spawn(this, new Member(`val()`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    valNull() {
        let context = Context.spawn(this, new Member(`val()`));
        return new RuleDataSnapshotNullValue(context);
    }

    child(path: PathBuilder | string) {
        path = typeof path === 'string' ? new PathBuilder(path) : path;
        let context = Context.spawn(this, new Member(`child(${path})`))
        return new RuleDataSnapshotContext(context);
    }

    parent() {
        let context = Context.spawn(this, new Member(`parent()`))
        return new RuleDataSnapshotContext(context);
    }

    hasChild(path: PathBuilder | string) {
        path = typeof path === 'string' ? new PathBuilder(path) : path;
        let context = Context.spawn(this, new Member(`hasChild(${path})`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    hasChildren(paths?: (PathBuilder | string)[]) {
        paths = (paths || []).map(path => typeof path === 'string' ? new PathBuilder(path) : path);
        let context = Context.spawn(this, new Member(`hasChildren(${paths.length ? '[' + paths.join(', ') + ']' : ''})`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    exists() {
        let context = Context.spawn(this, new Member(`exists()`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    getPriority() {
        let context = Context.spawn(this, new Member(`getPriority()`));
        return new RuleDataSnapshotValue(context);
    }

    isNumber() {
        let context = Context.spawn(this, new Member(`isNumber()`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    isString() {
        let context = Context.spawn(this, new Member(`isString()`));
        return new RuleDataSnapshotBooleanValue(context);
    }

    isBoolean() {
        let context = Context.spawn(this, new Member(`isBoolean()`));
        return new RuleDataSnapshotBooleanValue(context);
    }

}

export class RuleDataSnapshotValue
    extends Context
    implements Value {

    private appendOperator(operator: Token) {
        let context = Context.spawn(this, operator);
        return new RuleVariablesContext(context);
    }

    get and() {
        return this.appendOperator(Operators.and);
    }

    get or() {
        return this.appendOperator(Operators.or);
    }

    get greaterThan() {
        return this.appendOperator(Operators.greaterThan);
    }

    get greaterThanOrEqualTo() {
        return this.appendOperator(Operators.greaterThanOrEqualTo);
    }

    get lessThan() {
        return this.appendOperator(Operators.lessThan);
    }

    get lessThanOrEqualTo() {
        return this.appendOperator(Operators.lessThanOrEqualTo);
    }

    get add() {
        return this.appendOperator(Operators.add);
    }

    get subtract() {
        return this.appendOperator(Operators.subtract);
    }

    get multiply() {
        return this.appendOperator(Operators.multiply);
    }

    get divide() {
        return this.appendOperator(Operators.divide);
    }

    get modulus() {
        return this.appendOperator(Operators.modulus);
    }

}

export class RuleDataSnapshotNullValue
    extends RuleDataSnapshotValue
    implements NullValue {
}

export class RuleDataSnapshotBooleanValue
    extends RuleDataSnapshotValue
    implements BooleanValue {
}

export class RuleDataSnapshotNumberValue
    extends RuleDataSnapshotValue
    implements NumberValue {
}

export class RuleDataSnapshotStringValue
    extends RuleDataSnapshotValue
    implements StringValue {

    get length() {
        Context.push(this, new Member(`length`));
        return new RuleDataSnapshotNumberValue(this);
    }

    contains(substring: string) {
        Context.push(this, new Member(`contains('${substring}')`));
        return new RuleDataSnapshotBooleanValue(this);
    }

    beginsWith(substring: string) {
        Context.push(this, new Member(`beginsWith('${substring}')`));
        return new RuleDataSnapshotBooleanValue(this);
    }

    endsWith(substring: string) {
        Context.push(this, new Member(`endsWith('${substring}')`));
        return new RuleDataSnapshotBooleanValue(this);
    }

    replace(substring: string, replacement: string) {
        Context.push(this, new Member(`replace('${substring}','${replacement}')`));
        return new RuleDataSnapshotStringValue(this);
    }

    toLowerCase() {
        Context.push(this, new Member(`toLowerCase()`));
        return new RuleDataSnapshotStringValue(this);
    }

    toUpperCase() {
        Context.push(this, new Member(`toUpperCase()`));
        return new RuleDataSnapshotStringValue(this);
    }

    matches(regex: string) {
        Context.push(this, new Member(`matches(${regex})`));
        return new RuleDataSnapshotBooleanValue(this);
    }

}

export function ctx () {
    return new RuleVariablesContext();
}

let auth = (new RuleVariablesContext()).auth;
let now = (new RuleVariablesContext()).now;
let data = (new RuleVariablesContext()).data;
let newData = (new RuleVariablesContext()).newData;
let root = (new RuleVariablesContext()).root;

export {
    auth,
    now,
    root,
    data,
    newData
 };
