const chai = require('chai');
const expect = chai.expect;

const lib = require('../../lib');

describe('Builder can build in javascript', () => {

    it('rule with variable', () => {

        const noAuth = lib.auth.equal.evaluate(null);
        const nonNullAuth = lib.auth.unequal.evaluate(null);
        const passwordAuth = nonNullAuth.and.auth.provider.equal.evaluate('password');

        const rules = {
            rules: {
                allowedWithAuth: {
                    ".read": noAuth,
                    ".write": nonNullAuth
                },
                allowedWithPassword: {
                    ".read": passwordAuth,
                    ".write": passwordAuth
                }
            }
        };

        const builder = new lib.Builder();
        const result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            rules: {
                allowedWithAuth: {
                    ".read": "auth === null",
                    ".write": "auth !== null"
                },
                allowedWithPassword: {
                    ".read": "auth !== null && auth.provider === 'password'",
                    ".write": "auth !== null && auth.provider === 'password'"
                }
            }
        }));

    });

    it('rule with string data', () => {

        const nonNullAuth = lib.auth.unequal.evaluate(null);
        const passwordAuth = nonNullAuth.and.auth.provider.equal.evaluate('password');

        const rules = {
            rules: {
                user: {
                    name: {
                        ".validate": lib.newData.valString().length.lessThan.evaluate(100)
                    }
                }
            }
        };

        const builder = new lib.Builder();
        const result = builder.build(rules);

        expect(JSON.stringify(result)).to.be.equal(JSON.stringify({
            rules: {
                user: {
                    name: {
                        ".validate": "newData.val().length < 100"
                    }
                }
            }
        }));

    });

});
