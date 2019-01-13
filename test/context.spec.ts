import * as chai from 'chai';

const expect = chai.expect;

import {
    ctx,
    RuleDataSnapshotContext,
    RuleDataSnapshotValue,
    RuleDataSnapshotNullValue,
    RuleDataSnapshotBooleanValue,
    RuleDataSnapshotNumberValue,
    RuleDataSnapshotStringValue
} from "../src/Context";
import { path } from "../src/PathBuilder";

describe('Context produces correct string', () => {

    describe('with rule variable', () => {

        it('auth', () => {
            expect(ctx().auth.toString()).to.be.equal("auth");
        });

        it('auth.uid', () => {
            expect(ctx().auth.uid.toString()).to.be.equal("auth.uid");
        });

        it('now', () => {
            expect(ctx().now.toString()).to.be.equal("now");
        });

        it('root', () => {
            expect(ctx().root.toString()).to.be.equal("root");
        });

        it('data', () => {
            expect(ctx().data.toString()).to.be.equal("data");
        });

        it('newData', () => {
            expect(ctx().newData.toString()).to.be.equal("newData");
        });

    });

    describe('with rule data snapshot', () => {

        it('method val', () => {
            let val = ctx().data.val();
            expect(val).instanceOf(RuleDataSnapshotValue);
            expect(val.toString()).to.be.equal("data.val()");
        });

        it('method val for value type of string', () => {
            let val = ctx().data.valString();
            expect(val).instanceOf(RuleDataSnapshotStringValue);
            expect(val.toString()).to.be.equal("data.val()");
        });

        it('method val for value type of number', () => {
            let val = ctx().data.valNumber();
            expect(val).instanceOf(RuleDataSnapshotNumberValue);
            expect(val.toString()).to.be.equal("data.val()");
        });

        it('method val for value type of boolean', () => {
            let val = ctx().data.valBoolean();
            expect(val).instanceOf(RuleDataSnapshotBooleanValue);
            expect(val.toString()).to.be.equal("data.val()");
        });

        it('method val for value type of null', () => {
            let val = ctx().data.valNull();
            expect(val).instanceOf(RuleDataSnapshotNullValue);
            expect(val.toString()).to.be.equal("data.val()");
        });

        it('method child', () => {
            let snapshot = ctx().data.child(path("a"));
            expect(snapshot).instanceOf(RuleDataSnapshotContext);
            expect(snapshot.toString()).to.be.equal("data.child('a')");
        });

        it('method parent', () => {
            let snapshot = ctx().data.parent();
            expect(snapshot).instanceOf(RuleDataSnapshotContext);
            expect(snapshot.toString()).to.be.equal("data.parent()");
        });

        it('method hasChild', () => {
            let result = ctx().data.hasChild(path("a"));
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChild('a')");
        });

        it('method hasChildren without paths', () => {
            let result = ctx().data.hasChildren();
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren()");
        });

        it('method hasChildren with single path', () => {
            let result = ctx().data.hasChildren([path("a")]);
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren(['a'])");
        });

        it('method hasChildren with several paths', () => {
            let result = ctx().data.hasChildren([path("a"), path("b")]);
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren(['a','b'])");
        });

        it('method exists', () => {
            let result = ctx().data.exists();
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.exists()");
        });

        it('method getPriority', () => {
            let result = ctx().data.getPriority();
            expect(result).instanceOf(RuleDataSnapshotValue);
            expect(result.toString()).to.be.equal("data.getPriority()");
        });

        it('method isNumber', () => {
            let result = ctx().data.isNumber();
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.isNumber()");
        });

        it('method isString', () => {
            let result = ctx().data.isString();
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.isString()");
        });

        it('method isBoolean', () => {
            let result = ctx().data.isBoolean();
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.isBoolean()");
        });

    });

    describe('with rule string value', () => {

        it('on property length', () => {
            let result = ctx().data.valString().length;
            expect(result).instanceOf(RuleDataSnapshotNumberValue);
            expect(result.toString()).to.be.equal("data.val().length");
        });

        it('on method contains', () => {
            let result = ctx().data.valString().contains("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().contains('a')");
        });

        it('on method beginsWith', () => {
            let result = ctx().data.valString().beginsWith("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().beginsWith('a')");
        });

        it('on method endsWith', () => {
            let result = ctx().data.valString().endsWith("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().endsWith('a')");
        });

        it('on method replace', () => {
            let result = ctx().data.valString().replace("a", "b");
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().replace('a','b')");
        });

        it('on method toLowerCase', () => {
            let result = ctx().data.valString().toLowerCase();
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().toLowerCase()");
        });

        it('on method toUpperCase', () => {
            let result = ctx().data.valString().toUpperCase();
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().toUpperCase()");
        });

        it('on method matches', () => {
            let result = ctx().data.valString().matches("/a/i");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().matches(/a/i)");
        });

    })

});
