import * as chai from 'chai';

const expect = chai.expect;

import {
    Rules,
    Builder,
    ctx,
    path,
    auth,
    root,
    newData
} from '../../lib';

describe('Builder can build', () => {

    it('empty rules', () => {

        let rules: Rules<any> = {
            rules: {}
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{}}');

    });

    it('location rules', () => {

        let rules: Rules<any> = {
            rules: {
                ".read": true,
                ".write": true,
                ".validate": true
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{".read":true,".write":true,".validate":true}}');

    });

    it('index rules', () => {

        let rules: Rules<{ id: number }> = {
            rules: {
                ".indexOn": ["id"]
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{".indexOn":["id"]}}');

    });

    it('property rules', () => {

        let rules: Rules<{ property: any}> = {
            rules: {
                "property": {
                    ".validate": true
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{"property":{".validate":true}}}');

    });

    it('nested property rules', () => {

        let rules: Rules<{ property: { nestedProperty: any } }> = {
            rules: {
                "property": {
                    "nestedProperty": {
                        ".validate": true
                    }
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{"property":{"nestedProperty":{".validate":true}}}}');

    });

    it('collection rules', () => {

        let rules: Rules<{ entries: { name: string } }> = {
            rules: {
                "entries": {
                    "$id": {
                        "name": {
                            ".validate": true
                        }
                    }
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{"entries":{"$id":{"name":{".validate":true}}}}}');

    });

    it('rule with equal check', () => {

        let nonNullAuth = auth.unequal.evaluate(null);

        let rules: Rules<{}> = {
            rules: {
                ".read": nonNullAuth,
                ".write": nonNullAuth.and.auth.provider.equal.evaluate('password')
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "auth !== null",
                ".write": "auth !== null && auth.provider === 'password'"
            }
        }));
    });

    it('rule with property child path check', () => {

        let rules: Rules<any> = {
            rules: {
                ".read": ctx().root.child(path('users')).exists(),
                ".write": ctx().not.root.child(path('users').resolve(auth.uid)).exists()
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "root.child('users').exists()",
                ".write": "!root.child('users/' + auth.uid).exists()"
            }
        }));
    });

    it('rule with property child complex path check', () => {

        let rulePath = path('permissions/')
            .path('/users/')
            .resolve(ctx().auth.uid)
            .path('/status/')
            .path('/lock');

        let rules: Rules<any> = {
            rules: {
                ".read": root.child(rulePath).val().equal.evaluate(false)
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "root.child('permissions/users/' + auth.uid + '/status/lock').val() === false"
            }
        }));
    });

    it('rule with property has child check', () => {

        let rules: Rules<{ users: any }> = {
            rules: {
                "users": {
                    "$user_id": {
                        ".validate": newData.hasChild(path('name'))
                    }
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "users": {
                    "$user_id": {
                        ".validate": "newData.hasChild('name')"
                    }
                }
            }
        }));
    });

    it('rule with property has children check', () => {

        let rules: Rules<{ users: any }> = {
            rules: {
                "users": {
                    "$user_id": {
                        ".validate": newData.hasChildren([
                            path('name'),
                            path('age')
                        ])
                    }
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "users": {
                    "$user_id": {
                        ".validate": "newData.hasChildren(['name', 'age'])"
                    }
                }
            }
        }));
    });

    it('rule with property number type check', () => {

        let rules: Rules<{ number: number }> = {
            rules: {
                "number": {
                    ".validate": newData.isNumber().and.newData.val().greaterThan.evaluate(0)
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "number": {
                    ".validate": "newData.isNumber() && newData.val() > 0"
                }
            }
        }));
    });

    it('rule with property string type check', () => {

        let rules: Rules<{ string: string }> = {
            rules: {
                "string": {
                    ".validate": newData.isString().and.newData.valString().length.equal.evaluate(10)
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "string": {
                    ".validate": "newData.isString() && newData.val().length === 10"
                }
            }
        }));
    });
});
