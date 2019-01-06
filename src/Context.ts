import {
    Auth,
    AuthToken,
    RuleVariables,
    RuleDataSnapshot,
    NullValue,
    BooleanValue,
    NumberValue,
    StringValue
} from './firebase-database-rules';
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

export class ContextBase {

    private chain: string[];

    constructor(context?: ContextBase) {
        this.chain = context ? context.chain : [];
    }

    protected push(link: string) {
        this.chain.push(link);
    }

    toString() {
        return this.chain.join('.');
    }

}

export class RuleVariablesContext
    extends ContextBase
    implements ContextType<RuleVariables> {

    get auth() {
        this.push(`auth`);
        return new AuthContext(this);
    }

    get now() {
        this.push(`now`);
        return new RuleDataSnapshotNumberValue(this);
    }

    get root() {
        this.push(`root`);
        return new RuleDataSnapshotContext(this);
    }

    get data() {
        this.push(`data`);
        return new RuleDataSnapshotContext(this);
    }

    get newData() {
        this.push(`newData`);
        return new RuleDataSnapshotContext(this);
    }

}

export class AuthContext
    extends ContextBase
    implements ContextType<Auth> {

    get provider() {
        this.push(`provider`);
        return new RuleDataSnapshotValue(this);
    }

    get uid() {
        this.push(`uid`);
        return new RuleDataSnapshotValue(this);
    }

    get token() {
        this.push(`token`);
        return new AuthTokenContext(this);
    }

}

export class AuthTokenContext
    extends ContextBase
    implements ContextType<AuthToken> {

    get email() {
        this.push(`email`);
        return new RuleDataSnapshotStringValue(this);
    }

    get email_verified() {
        this.push(`email_verified`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    get phone_number() {
        this.push(`phone_number`);
        return new RuleDataSnapshotStringValue(this);
    }

    get name() {
        this.push(`name`);
        return new RuleDataSnapshotStringValue(this);
    }

    get sub() {
        this.push(`sub`);
        return new RuleDataSnapshotStringValue(this);
    }

    get 'firebase.identities'() {
        this.push(`firebase.identities`);
        return new RuleDataSnapshotStringValue(this); // TODO
    }

    get 'firebase.sign_in_provider'() {
        this.push(`firebase.sign_in_provider`);
        return new RuleDataSnapshotStringValue(this);
    }

    get iss() {
        this.push(`iss`);
        return new RuleDataSnapshotStringValue(this);
    }

    get aud() {
        this.push(`aud`);
        return new RuleDataSnapshotStringValue(this);
    }

    get auth_time() {
        this.push(`auth_time`);
        return new RuleDataSnapshotStringValue(this);
    }

    get iat() {
        this.push(`iat`);
        return new RuleDataSnapshotStringValue(this);
    }

    get exp() {
        this.push(`exp`);
        return new RuleDataSnapshotStringValue(this);
    }

}

export class RuleDataSnapshotContext
    extends ContextBase
    implements ContextType<RuleDataSnapshot> {

    val() {
        this.push(`val()`);
        return new RuleDataSnapshotValue(this);
    }

    valAsString() {
        this.push(`val()`);
        return new RuleDataSnapshotStringValue(this);
    }

    valAsNumber() {
        this.push(`val()`);
        return new RuleDataSnapshotNumberValue(this);
    }

    valAsBoolean() {
        this.push(`val()`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    valAsNull() {
        this.push(`val()`);
        return new RuleDataSnapshotNullValue(this);
    }

    child(path: PathBuilder) {
        this.push(`child(${path})`);
        return new RuleDataSnapshotContext(this);
    }

    parent() {
        this.push(`parent()`);
        return new RuleDataSnapshotContext(this);
    }

    hasChild(path: PathBuilder) {
        this.push(`hasChild(${path})`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    hasChildren(paths: PathBuilder[]) {
        this.push(`hasChildren(${paths ? '[' + paths + ']' : ''})`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    exists() {
        this.push(`exists()`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    getPriority() {
        this.push(`getPriority()`);
        return new RuleDataSnapshotValue(this);
    }

    isNumber() {
        this.push(`isNumber()`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    isString() {
        this.push(`isString()`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    isBoolean() {
        this.push(`isBoolean()`);
        return new RuleDataSnapshotBooleanValue(this);
    }

}

export class RuleDataSnapshotValue
    extends ContextBase {
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
        this.push(`length`);
        return new RuleDataSnapshotNumberValue(this);
    }

    contains(substring: string) {
        this.push(`contains('${substring}')`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    beginsWith(substring: string) {
        this.push(`beginsWith('${substring}')`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    endsWith(substring: string) {
        this.push(`endsWith('${substring}')`);
        return new RuleDataSnapshotBooleanValue(this);
    }

    replace(substring: string, replacement: string) {
        this.push(`replace('${substring}','${replacement}')`);
        return new RuleDataSnapshotStringValue(this);
    }

    toLowerCase() {
        this.push(`toLowerCase()`);
        return new RuleDataSnapshotStringValue(this);
    }

    toUpperCase() {
        this.push(`toUpperCase()`);
        return new RuleDataSnapshotStringValue(this);
    }

    matches(regex: string) {
        this.push(`matches(${regex})`);
        return new RuleDataSnapshotBooleanValue(this);
    }

}

export function ctx () {
    return new RuleVariablesContext();
}
