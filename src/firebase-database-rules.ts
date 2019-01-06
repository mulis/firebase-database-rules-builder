// Common

type Keys<T> = keyof T;

type Partial<T> = {
    [P in keyof T]?: T[P];
}

export type Collection<T> = {
    [ key: string ]: {
        [ P in keyof T]: T[P];
    }
}

export interface NullValue { }

export interface BooleanValue { }

export interface NumberValue { }

export interface StringValue {

    length: NumberValue;

    contains(substring: string): BooleanValue;

    beginsWith(substring: string): BooleanValue;

    endsWith(substring: string): BooleanValue;

    replace(substring: string, replacement: string): StringValue;

    toLowerCase(): StringValue;

    toUpperCase(): StringValue;

    matches(regex: string): BooleanValue;

}

// Rule types

export enum ReservedKeys {
    read = '.read',
    write = '.write',
    validate = '.validate',
    indexOn = '.indexOn',
}

export enum ReservedValues {
    value = '.value',
}

export type LocationRuleDefinition = BooleanValue | StringValue;

export type LocationRule<T> = {
    [ReservedKeys.read]?: LocationRuleDefinition;
    [ReservedKeys.write]?: LocationRuleDefinition;
    [ReservedKeys.validate]?: LocationRuleDefinition;
};

export type PropertyRuleDefinition<T> = LocationRule<T> | EntityRule<T> | CollectionRule<T>;

export type PropertyRule<T> = {
    [ P in keyof T ]: PropertyRuleDefinition<T[P]>;
};

export type EntityRule<T> = LocationRule<T> & PropertyRule<T>;

export type CollectionIndexRuleDefinition<T> = (keyof T)[] | ReservedValues.value;

export type CollectionIndexRule<T> = {
    [ReservedKeys.indexOn]?: CollectionIndexRuleDefinition<T>;
};

export type CollectionEntityRuleDefinition<T> = LocationRuleDefinition | CollectionIndexRuleDefinition<T> | EntityRule<T>;

export type CollectionEntityRule<T> = {
    [ key: string ]: CollectionEntityRuleDefinition<T>;
};

export type CollectionRule<T> = LocationRule<T> & CollectionIndexRule<T> & CollectionEntityRule<T>;

export type RulesDefinition<T> = LocationRule<T> | PropertyRule<T> | EntityRule<T> | CollectionRule<T>;

export interface Rules<T> {

    rules: RulesDefinition<T>;

}

// Rule variables

export type provider = 'custom' | 'password' | 'phone' | 'anonymous' | 'google.com' | 'facebook.com' | 'github.com' | 'twitter.com';

export type identity = 'email' | 'phone' | 'google.com' | 'facebook.com' | 'github.com' | 'twitter.com';

export interface AuthToken {

    email: StringValue;

    email_verified: BooleanValue;

    phone_number: StringValue;

    name: StringValue;

    sub: StringValue;

    'firebase.identities': {
        [ key in identity ]: any[]
    },

    'firebase.sign_in_provider': provider;

    // Additional fields

    // The issuer of the token.
    iss: any;
    // The audience for the token.
    aud: any;
    // The last time the user authenticated with a credential using the device receiving the token.
    auth_time: any;
    // The time at which the token was issued.
    iat: any;
    // The time at which the token expires.
    exp: any;
}

export interface Auth {

    provider: provider;

    uid: StringValue;

    token: AuthToken;

}

export interface RuleVariables {

    auth: Auth;

    now: NumberValue;

    root: RuleDataSnapshot;

    data: RuleDataSnapshot;

    newData: RuleDataSnapshot;

    // [ location: string ]: string;

}

// Rule data snapshot

export interface RuleDataSnapshot {

    val(): StringValue | NumberValue | BooleanValue | NullValue;

    child(path: string): RuleDataSnapshot;

    parent(): RuleDataSnapshot;

    hasChild(path: string): BooleanValue;

    hasChildren(paths: string[]): BooleanValue;

    exists(): BooleanValue;

    getPriority(): StringValue | NumberValue | NullValue;

    isNumber(): BooleanValue;

    isString(): BooleanValue;

    isBoolean(): BooleanValue;

}

// Rule operators

export interface UnaryOperator {
}

export interface BinaryOperator {
}

export interface TernaryOperator {
}

export interface RuleOperators {

    add: BinaryOperator;

    subtract: BinaryOperator;

    negate: UnaryOperator;

    multiply: BinaryOperator;

    divide: BinaryOperator;

    modulus: BinaryOperator;

    equals: BinaryOperator;

    notEquals: BinaryOperator;

    and: BinaryOperator;

    or: BinaryOperator;

    not: UnaryOperator;

    greaterThan: BinaryOperator;

    lessThan: BinaryOperator;

    greaterThanOrEqualTo: BinaryOperator;

    lessThanOrEqualTo: BinaryOperator;

    ternary: TernaryOperator;

}
