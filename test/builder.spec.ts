import * as chai from 'chai';

const expect = chai.expect;

import { Rules } from "../src/firebase-database-rules";
import { Builder } from "../src/Builder";
import { check } from "../src/Check";
import { ctx } from "../src/Context";
import { path } from "../src/PathBuilder";

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

        let rules: Rules<any> = {
            rules: {
                ".indexOn": ["id"]
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal('{"rules":{".indexOn":["id"]}}');

    });

    it('property rules', () => {

        let rules: Rules<any> = {
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

        let rules: Rules<any> = {
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

        let rules: Rules<any> = {
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

        let rules: Rules<any> = {
            rules: {
                ".read": check().unequal(ctx().auth, null),
                ".write": check().unequal(ctx().auth, null).and.equal(ctx().auth.provider, 'password')
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "auth!==null",
                ".write": "auth!==null&&auth.provider==='password'"
            }
        }));
    });

    it('rule with property child path check', () => {

        let rules: Rules<any> = {
            rules: {
                ".read": check().condition(ctx().root.child(path('users')).exists()),
                ".write": check().not.condition(ctx().root.child(path('users').resolve(ctx().auth.uid)).exists())
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "root.child('users').exists()",
                ".write": "!root.child('users/'+auth.uid).exists()"
            }
        }));
    });

    it('rule with property child complex path check', () => {

        let rules: Rules<any> = {
            rules: {
                ".read": check().equal(ctx().root.child(
                    path('permissions/')
                        .path('/users/')
                        .resolve(ctx().auth.uid)
                        .path('/status/')
                        .path('/lock')
                ).val(), false)
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                ".read": "root.child('permissions/users/'+auth.uid+'/status/lock').val()===false"
            }
        }));
    });

    it('rule with property child has check', () => {

        let rules: Rules<any> = {
            rules: {
                "users": {
                    "$user_id": {
                        ".validate": check().condition(
                            ctx().newData.hasChild(path('name'))
                        )
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

    it('rule with property children has check', () => {

        let rules: Rules<any> = {
            rules: {
                "users": {
                    "$user_id": {
                        ".validate": check().condition(
                            ctx().newData.hasChildren([
                                path('name'),
                                path('age')
                            ])
                        )
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
                        ".validate": "newData.hasChildren(['name','age'])"
                    }
                }
            }
        }));
    });

    it('rule with property number type check', () => {

        let rules: Rules<any> = {
            rules: {
                "number": {
                    ".validate": check().condition(ctx().newData.isNumber())
                        .and.greaterThan(ctx().newData.valNumber(), 0)
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "number": {
                    ".validate": "newData.isNumber()&&newData.val()>0"
                }
            }
        }));
    });

    it('rule with property string type check', () => {

        let rules: Rules<any> = {
            rules: {
                "string": {
                    ".validate": check().condition(ctx().newData.isString())
                        .and.equal(ctx().newData.valString().length, 10)
                }
            }
        };

        let builder = new Builder();
        let result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            "rules": {
                "string": {
                    ".validate": "newData.isString()&&newData.val().length===10"
                }
            }
        }));
    });
});
