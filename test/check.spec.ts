import * as chai from 'chai';

const expect = chai.expect;

import {
    check,
    ctx,
    add
} from '../lib';

describe('Check produces correct string with', () => {

    it('empty check', () => {
        expect(check().toString()).to.be.equal("");
    });

    it('condition check', () => {
        expect(check().condition(true).toString()).to.be.equal("true");
    });

    it('condition check with expression', () => {
        expect(check().condition(add(1, 1)).toString()).to.be.equal("1 + 1");
    });

    it('and check', () => {
        expect(check().condition(true).and.condition(false).toString()).to.be.equal("true && false");
    });

    it('or check', () => {
        expect(check().condition(true).or.condition(false).toString()).to.be.equal("true || false");
    });

    it('not check', () => {
        expect(check().not.condition(true).toString()).to.be.equal("!true");
    });

    it('equal check', () => {
        expect(check().equal(ctx().now, 1).toString()).to.be.equal("now === 1");
    });

    it('unequal check', () => {
        expect(check().unequal(ctx().now, 1).toString()).to.be.equal("now !== 1");
    });

    it('greaterThan check', () => {
        expect(check().greaterThan(ctx().now, 1).toString()).to.be.equal("now > 1");
    });

    it('greaterThanOrEqualTo check', () => {
        expect(check().greaterThanOrEqualTo(ctx().now, 1).toString()).to.be.equal("now >= 1");
    });

    it('lessThan check', () => {
        expect(check().lessThan(ctx().now, 1).toString()).to.be.equal("now < 1");
    });

    it('lessThanOrEqualTo check', () => {
        expect(check().lessThanOrEqualTo(ctx().now, 1).toString()).to.be.equal("now <= 1");
    });

    it('ternary check', () => {
        expect(check().ternary(true, 1, 0).toString()).to.be.equal("true ? 1 : 0");
    });

});
