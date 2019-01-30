import * as chai from 'chai';

const expect = chai.expect;

import { path } from '../lib';

describe('PathBuilder produces correct string', () => {

    it('with empty path', () => {
        let result = path("");
        expect(result.toString()).to.be.equal("");
    });

    it('with static path', () => {
        let result = path("/a/b/c");
        expect(result.toString()).to.be.equal("'/a/b/c'");
    });

    it('with static paths', () => {
        let result = path("a").path("b").path("c");
        expect(result.toString()).to.be.equal("'a/b/c'");
    });

    it('with dynamic path', () => {
        let result = path("").resolve("a");
        expect(result.toString()).to.be.equal("a");
    });

    it('with static paths and dynamic path at the start', () => {
        let result = path("").resolve("a").path("b").path("c");
        expect(result.toString()).to.be.equal("a + '/b/c'");
    });

    it('with static paths and dynamic path at the end', () => {
        let result = path("a").path("b").resolve("c");
        expect(result.toString()).to.be.equal("'a/b/' + c");
    });

    it('with static paths and dynamic path in the middle', () => {
        let result = path("a").resolve("b").path("c");
        expect(result.toString()).to.be.equal("'a/' + b + '/c'");
    });

});
