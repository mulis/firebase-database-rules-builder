import * as chai from 'chai';

const expect = chai.expect;

import { EntityRule } from '../../lib';

import { User } from './common.spec';

describe('Entity rule definition', () => {

    it('work with location', () => {

        let user: EntityRule<User> = {
            ".validate": true
        };

        expect(user).to.be.equal(user);

    });

    it('work with property', () => {

        let user: EntityRule<User> = {
            "name": {
                ".validate": true
            }
        };

        expect(user).to.be.equal(user);

    });

    it('work with nested property', () => {

        let user: EntityRule<User> = {
            name: {
                ".validate": true
            },
            permissions: {
                read: {
                    ".validate": true
                },
                write: {
                    ".validate": true
                }
            },
            relatives: {
                "$id": {
                    ".indexOn": ["name"],
                    "$other": {
                        ".validate": false
                    }
                }
            }
        };

        expect(user).to.be.equal(user);

    });

    it('work with collection', () => {

        let user: EntityRule<User> = {
            "relatives": {
                ".indexOn": [ "name" ],
                "$key": {
                    name: {
                        ".validate": true
                    }
                }
            }
        };

        expect(user).to.be.equal(user);

    });

    it('work with location, property, nested property and collection', () => {

        let user: EntityRule<User> = {

            ".validate": true,

            "name": {
                ".validate": true
            },

            "permissions": {
                "read": {
                    ".validate": true
                },
                "write": {
                    ".validate": true
                }
            },

            "relatives": {
                ".indexOn": [ "name" ],
                "$key": {
                    name: {
                        ".validate": true
                    }
                }
            }
        };

        expect(user).to.be.equal(user);

    });

});
