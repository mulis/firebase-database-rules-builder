import {
    Collection,
    EntityRule,
    PropertyRule,
    CollectionRule
} from '../lib';

interface Permissions {

    read: boolean;

    write: boolean;

}

interface Relative {

    id: number;

    name?: string;

    status?: number;

}

interface User {

    id?: number;

    name?: string;

    permissions?: Permissions;

    relatives?: Collection<Relative>;

}

describe('Entity rule definition', () => {

    it('work with location', () => {

        let user: EntityRule<User> = {
            ".validate": true
        };

    });

    it('work with property', () => {

        let user: EntityRule<User> = {
            "name": {
                ".validate": true
            }
        };

    });

    it('work with nested property', () => {

        let user: EntityRule<User> = {
            "permissions": <PropertyRule<Permissions>>{
                "read": {
                    ".validate": true
                },
                "write": {
                    ".validate": true
                }
            }
        };

    });

    it('work with collection', () => {

        let user: EntityRule<User> = {
            "relatives": <CollectionRule<Relative>>{
                ".indexOn": [ "id" ],
                "$key": {
                    id: {
                        ".validate": true
                    },
                    name: {
                        ".validate": true
                    }
                }
            }
        };

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

            "relatives": <CollectionRule<Relative>>{
                ".indexOn": [ "id" ],
                "$key": {
                    id: {
                        ".validate": true
                    },
                    name: {
                        ".validate": true
                    }
                }
            }
        };

    });

});
