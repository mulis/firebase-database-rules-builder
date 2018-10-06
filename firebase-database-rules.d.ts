// Common

type Keys<T> = keyof T;

type Partial<T> = {
    [P in keyof T]?: T[P];
}

type Collection<T> = {
    [ key: string ]: {
        [ P in keyof T]: T[P];
    }
}

// Rule types

export type LocationRuleDefinition = boolean | string;

export type LocationRule<T> = {
    '.read'?: LocationRuleDefinition;
    '.write'?: LocationRuleDefinition;
    '.validate'?: LocationRuleDefinition;
};

export type PropertyRuleDefinition<T> = LocationRule<T> | EntityRule<T> | CollectionRule<T>;

export type PropertyRule<T> = {
    [ P in keyof T ]: PropertyRuleDefinition<T[P]>;
};

export type EntityRule<T> = LocationRule<T> & PropertyRule<T>;

export type CollectionIndexRuleDefinition<T> = (keyof T)[] | '.value';

export type CollectionIndexRule<T> = {
    '.indexOn'?: CollectionIndexRuleDefinition<T>;
};

export type CollectionEntityRuleDefinition<T> = LocationRuleDefinition | CollectionIndexRuleDefinition<T> | EntityRule<T>;

export type CollectionEntityRule<T> = {
    [ key: string ]: CollectionEntityRuleDefinition<T>;
};

export type CollectionRule<T> = LocationRule<T> & CollectionIndexRule<T> & CollectionEntityRule<T>;

export type RulesDefinition<T> = LocationRule<T> | PropertyRule<T> | EntityRule<T> | CollectionRule<T>;

export type Rules = {
    rules: RulesDefinition<any>;
};

// Rule variables

export type provider = 'custom' | 'password' | 'phone' | 'anonymous' | 'google.com' | 'facebook.com' | 'github.com' | 'twitter.com';

export type identity = 'email' | 'phone' | 'google.com' | 'facebook.com' | 'github.com' | 'twitter.com';

export interface AuthToken {

    email: string;

    email_verified: boolean;

    phone_number: string;

    name: string;

    sub: string;

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

    uid: string;

    token: AuthToken;

}

export interface RuleVariables {

    auth: Auth;

    now: number;

    root: RuleDataSnapshot;

    data: RuleDataSnapshot;

    newData: RuleDataSnapshot;

    // [ location: string ]: string;

}

// Rule data snapshot

export interface StringValue {

    length: number;

    contains(substring: string): boolean;

    beginsWith(substring: string): boolean;

    endsWith(substring: string): boolean;

    replace(substring: string, replacement: string): StringValue;

    toLowerCase(): StringValue;

    toUpperCase(): StringValue;

    matches(regex: string): boolean;

}

export interface RuleDataSnapshot {

    val(): StringValue | number | boolean | null;

    child(path: string): RuleDataSnapshot;

    parent(): RuleDataSnapshot;

    hasChild(path: string): boolean;

    hasChildren(paths: string[]): boolean;

    exists(): boolean;

    getPriority(): string | number | null;

    isNumber(): boolean;

    isString(): boolean;

    isBoolean(): boolean;

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
