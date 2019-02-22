import * as chai from 'chai';

const expect = chai.expect;

import {
    CollectionRule,
    ctx
} from '../lib';

import { User, Relative } from './common.spec';

describe('Collection rule definition', () => {

    it('work with location', () => {

        let users: CollectionRule<User> = {
            ".validate": true,
            "$id": {
                name: 'ame'
            }
        };

        expect(users).to.exist;

    });

    it('work with index', () => {

        let users: CollectionRule<User> = {
            ".indexOn": [ "name" ]
        };

        expect(users).to.exist;

    });

    it('work with index on value', () => {

        let users: CollectionRule<User> = {
            ".indexOn": ".value"
        };

        expect(users).to.exist;

    });

    it('work with entity location', () => {

        let users: CollectionRule<User> = {
            "$id": {
                ".validate": true
            }
        };

        expect(users).to.exist;

    });

    it('work with entity property', () => {

        let users: CollectionRule<User> = {
            "$id": {
                "name": {
                    ".validate": true
                }
            }
        };

        expect(users).to.exist;

    });

    it('work with location, index, entity location and entity property', () => {

        let users: CollectionRule<User> = {

            ".validate": true,

            ".indexOn": [ "name" ],

            "$id": {

                ".validate": true,

                "name": {
                    ".validate": true
                },

                "$other": {
                    ".validate": false
                }

            }
        };

        expect(users).to.exist;

    });

    it('work with data context', () => {

        let users: CollectionRule<User> = {
            ".read": true,
            ".write": ctx().not.auth.provider.equal.evaluate('anonymous'),
            "$id": {
                ".validate": ctx().not.data.exists(),
                name: {
                    ".validate": ctx().newData.isString().and.newData.valString().length.lessThan.evaluate(100)
                }
            }
        };

        expect(users).to.exist;

    });

    it('work with nested collection', () => {

        let users: CollectionRule<User> = {
            ".read": true,
            ".write": ctx().not.auth.provider.equal.evaluate('anonymous'),
            "$id": {
                ".validate": ctx().not.data.exists(),
                name: {
                    ".validate": ctx().newData.isString().and.newData.valString().length.lessThan.evaluate(100)
                },
                relatives: <CollectionRule<{ "$relative_id": Relative }>> {
                    "$relative_id": {
                        ".validate": ctx().root.hasChild("users/ + $relative_id")
                    }
                }
            }
        };

        expect(users).to.exist;

    });

});
