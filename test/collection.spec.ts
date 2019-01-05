import * as chai from 'chai';

import { CollectionRule } from '../src/firebase-database-rules';

class User {

    id?: number;

    name?: string;

}

describe('Collection rule definition', () => {

    it('work with location', () => {

        let users: CollectionRule<User> = {
            ".validate": true
        };

    });

    it('work with index', () => {

        let users: CollectionRule<User> = {
            ".indexOn": [ "id" ]
        };

    });

    it('work with entity location', () => {

        let users: CollectionRule<User> = {
            "$user": {
                ".validate": true
            }
        };

    });

    it('work with entity property', () => {

        let users: CollectionRule<User> = {
            "$user": {
                "id": {
                    ".validate": true
                }
            }
        };

    });

    it('work with location, index, entity location and entity property', () => {

        let users: CollectionRule<User> = {

            ".validate": true,

            ".indexOn": [ "id" ],

            "$user": {

                ".validate": true,

                "id": {
                    ".validate": true
                }
            }
        };

    });

});
