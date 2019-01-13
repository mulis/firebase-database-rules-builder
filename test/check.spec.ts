import * as chai from 'chai';

const expect = chai.expect;

import { check } from "../src/Check";
import { ctx } from "../src/Context";

describe('Check produces correct string with', () => {

    it('empty check', () => {
        expect(check().toString()).to.be.equal("");
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

    it('and check', () => {
        expect(check().condition(ctx().newData.isString()).and.greaterThan(ctx().newData.valString().length, 1).toString()).to.be.equal("newData.isString() && newData.val().length > 1");
    });

    it('or check', () => {
        expect(check().not.condition(ctx().data.exists()).or.not.condition(ctx().newData.exists()).toString()).to.be.equal("!data.exists() || !newData.exists()");
    });

    it('not check', () => {
        expect(check().not.condition(ctx().data.exists()).toString()).to.be.equal("!data.exists()");
    });

});
