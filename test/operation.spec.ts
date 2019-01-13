import * as chai from 'chai';

const expect = chai.expect;

import { check } from '../src/Check';

import {
    add,
    subtract,
    multiply,
    divide,
    modulus,
    scope,
    negate,
    ternary
} from "../src/Operation";

describe('Expression produces correct string', () => {

    it('while add two strings', () => {
        expect(add(1, 1).toString()).to.be.equal("1 + 1");
    });

    it('while add two numbers', () => {
        expect(add(1, 1).toString()).to.be.equal("1 + 1");
    });

    it('while subtract two numbers', () => {
        expect(subtract(1, 1).toString()).to.be.equal("1 - 1");
    });

    it('while multiply two numbers', () => {
        expect(multiply(1, 1).toString()).to.be.equal("1 * 1");
    });

    it('while divide two numbers', () => {
        expect(divide(1, 1).toString()).to.be.equal("1 / 1");
    });

    it('while modulus two numbers', () => {
        expect(modulus(1, 1).toString()).to.be.equal("1 % 1");
    });

    it('while modulus two numbers', () => {
        expect(modulus(1, 1).toString()).to.be.equal("1 % 1");
    });

    it('with nested expressions', () => {
        expect(add(multiply(1, 1), multiply(2, 2)).toString()).to.be.equal("1 * 1 + 2 * 2");
    });

    it('with scoped value', () => {
        expect(scope(1).toString()).to.be.equal("(1)");
    });

    it('with scoped expression', () => {
        expect(
            multiply(
                scope(add(1, 1)),
                scope(add(2, 2))
            ).toString()
        ).to.be.equal("(1 + 1) * (2 + 2)");
    });

    it('with negated value', () => {
        expect(negate(1).toString()).to.be.equal("-1");
    });

    it('with negated scoped expression', () => {
        expect(negate(scope(add(1, 1))).toString()).to.be.equal("-(1 + 1)");
    });

    it('with ternary expression', () => {
        expect(ternary(true, 1, 0).toString()).to.be.equal("true ? 1 : 0");
    });

});
