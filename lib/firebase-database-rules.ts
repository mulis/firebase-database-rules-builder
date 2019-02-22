// Common

export type Keys<T> = keyof T;

export type Collection<T> = {
    [ key: string ]: {
        [ K in Keys<T>]: T[K];
    }
}

export type Primitive = string | number | boolean | null;

export interface Value { }

export interface NullValue extends Value { }

export interface BooleanValue extends Value { }

export interface NumberValue extends Value { }

export interface StringValue extends Value {

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
    id = '$id',
    location = '$location',
    other = '$other'
}

export enum ReservedValues {
    value = '.value'
}

export type ReservedIndexOnValue = '.value';

export type AccessRuleDefinition = Primitive | Value | BooleanValue | StringValue;

export type AccessRule = {
    [ ReservedKeys.read ]?: AccessRuleDefinition;
    [ ReservedKeys.write ]?: AccessRuleDefinition;
    [ ReservedKeys.validate ]?: AccessRuleDefinition;
};

export type LocationRule = {
    [ ReservedKeys.location ]?: AccessRule;
    [ ReservedKeys.other ]?: AccessRule;
};

export type PropertyRuleDefinition<T> =
    T extends Primitive ?
        AccessRule | T :
        AccessRule | EntityRule<T> | CollectionRule<T>;

export type PropertyRule<T> = {
    [ K in Keys<T> ]: PropertyRuleDefinition<T[K]>;
};

export type EntityRule<T> = AccessRule & LocationRule & PropertyRule<T>;

export type CollectionIndexRuleDefinition<T> = Keys<T>[] | ReservedIndexOnValue;

export type CollectionIndexRule<T> = {
    [ ReservedKeys.indexOn ]?: CollectionIndexRuleDefinition<T>;
};

export type CollectionEntityRule<T> = {
    [ ReservedKeys.id ]?: EntityRule<T>;
};

export type CollectionEntityWithIdRule<T> = {
    [ K in Keys<T> ]?: EntityRule<T[K]>;
}

export type CollectionRule<T> =
    AccessRule
    & CollectionIndexRule<T>
    & (CollectionEntityRule<T> | CollectionEntityWithIdRule<T> );

export type RulesDefinition<T> = EntityRule<T> | CollectionRule<T>;

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
