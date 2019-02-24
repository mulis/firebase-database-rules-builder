import * as chai from 'chai';

const expect = chai.expect;

import {
    RuleDataSnapshotContext,
    RuleDataSnapshotValue,
    RuleDataSnapshotNullValue,
    RuleDataSnapshotBooleanValue,
    RuleDataSnapshotNumberValue,
    RuleDataSnapshotStringValue,
    ctx,
    path,
    auth,
    now,
    root,
    data,
    newData
} from "../../lib";

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

    describe('with exported rule variable', () => {

        it('auth', () => {
            expect(auth.toString()).to.be.equal('auth');
            expect(auth.uid.toString()).to.be.equal('auth.uid');
            expect(auth.token.toString()).to.be.equal('auth.token');
            expect(auth.token.email.toString()).to.be.equal('auth.token.email');
            expect(auth.token.name.toString()).to.be.equal('auth.token.name');
        });

        it('now', () => {
            expect(now.toString()).to.be.equal('now');
        });

        it('root', () => {
            expect(root.toString()).to.be.equal('root');
            expect(root.exists().toString()).to.be.equal('root.exists()');
            expect(root.isBoolean().toString()).to.be.equal('root.isBoolean()');
        });

        it('data', () => {
            expect(data.toString()).to.be.equal('data');
            expect(data.exists().toString()).to.be.equal('data.exists()');
            expect(data.isBoolean().toString()).to.be.equal('data.isBoolean()');
        });

        it('newData', () => {
            expect(newData.toString()).to.be.equal('newData');
            expect(newData.exists().toString()).to.be.equal('newData.exists()');
            expect(newData.isBoolean().toString()).to.be.equal('newData.isBoolean()');
        });

    });

    describe('with stored rule', () => {

        it('operation not', () => {
            let not = ctx().not;
            expect(not.data.exists().toString()).to.be.equal('!data.exists()');
            expect(not.data.isBoolean().toString()).to.be.equal('!data.isBoolean()');
        });

        it('operation negate', () => {
            let negate = ctx().negate;
            expect(negate.data.val().toString()).to.be.equal('-data.val()');
            expect(negate.newData.val().toString()).to.be.equal('-newData.val()');
        });

        it('method evaluate', () => {
            let evaluate = ctx().evaluate;
            expect(evaluate(1).toString()).to.be.equal("1");
            expect(evaluate('1').toString()).to.be.equal("'1'");
            expect(evaluate(newData.isBoolean()).toString()).to.be.equal("newData.isBoolean()");
        });

        it('method scope', () => {
            let scope = ctx().scope;
            expect(scope(1).toString()).to.be.equal("(1)");
            expect(scope('1').toString()).to.be.equal("('1')");
        });

    });

    describe('with chained rule', () => {

        it('operation equal', () => {
            expect(data.val().equal.newData.val().toString()).to.be.equal('data.val() === newData.val()');
        });

        it('operation unequal', () => {
            expect(data.val().unequal.newData.val().toString()).to.be.equal('data.val() !== newData.val()');
        });

        it('operation not', () => {
            expect(data.val().equal.not.newData.val().toString()).to.be.equal('data.val() === !newData.val()');
        });

        it('operation negate', () => {
            expect(data.val().equal.negate.newData.val().toString()).to.be.equal('data.val() === -newData.val()');
        });

        it('method evaluate', () => {
            expect(data.val().equal.evaluate(1).toString()).to.be.equal('data.val() === 1');
        });

        it('method scope', () => {
            expect(data.exists().and.scope(data.val().unequal.newData.val()).toString()).to.be.equal('data.exists() && (data.val() !== newData.val())');
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

        it('method child with string path', () => {
            let snapshot = ctx().data.child("a");
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

        it('method hasChild with string path', () => {
            let result = ctx().data.hasChild("a");
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

        it('method hasChildren with single string path', () => {
            let result = ctx().data.hasChildren(["a"]);
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren(['a'])");
        });

        it('method hasChildren with several paths', () => {
            let result = ctx().data.hasChildren([path("a"), path("b")]);
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren(['a', 'b'])");
        });

        it('method hasChildren with several string paths', () => {
            let result = ctx().data.hasChildren(["a", "b"]);
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.hasChildren(['a', 'b'])");
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

        it('property length', () => {
            let result = ctx().data.valString().length;
            expect(result).instanceOf(RuleDataSnapshotNumberValue);
            expect(result.toString()).to.be.equal("data.val().length");
        });

        it('method contains', () => {
            let result = ctx().data.valString().contains("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().contains('a')");
        });

        it('method beginsWith', () => {
            let result = ctx().data.valString().beginsWith("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().beginsWith('a')");
        });

        it('method endsWith', () => {
            let result = ctx().data.valString().endsWith("a");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().endsWith('a')");
        });

        it('method replace', () => {
            let result = ctx().data.valString().replace("a", "b");
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().replace('a','b')");
        });

        it('method toLowerCase', () => {
            let result = ctx().data.valString().toLowerCase();
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().toLowerCase()");
        });

        it('method toUpperCase', () => {
            let result = ctx().data.valString().toUpperCase();
            expect(result).instanceOf(RuleDataSnapshotStringValue);
            expect(result.toString()).to.be.equal("data.val().toUpperCase()");
        });

        it('method matches', () => {
            let result = ctx().data.valString().matches("/a/i");
            expect(result).instanceOf(RuleDataSnapshotBooleanValue);
            expect(result.toString()).to.be.equal("data.val().matches(/a/i)");
        });

    });

    describe('with string value chain', () => {

        it('operation add', () => {
            expect(data.valString().add.newData.valString().toString()).to.be.equal('data.val() + newData.val()');
        });

    });

    describe('with boolean value chain', () => {

        it('operation and', () => {
            expect(data.isBoolean().and.newData.isBoolean().toString()).to.be.equal('data.isBoolean() && newData.isBoolean()');
        });

        it('operation or', () => {
            expect(newData.isNumber().or.newData.isString().toString()).to.be.equal('newData.isNumber() || newData.isString()');
            expect(newData.val().equal.evaluate(1).or.newData.val().equal.evaluate(2).toString()).to.be.equal('newData.val() === 1 || newData.val() === 2');
        });

    });

    describe('with number value chain', () => {

        it('operation greaterThan', () => {
            expect(newData.valNumber().greaterThan.now.toString()).to.be.equal('newData.val() > now');
        });

        it('operation greaterThanOrEqualTo', () => {
            expect(newData.valNumber().greaterThanOrEqualTo.now.toString()).to.be.equal('newData.val() >= now');
        });

        it('operation lessThan', () => {
            expect(newData.valNumber().lessThan.now.toString()).to.be.equal('newData.val() < now');
        });

        it('operation lessThanOrEqualTo', () => {
            expect(newData.valNumber().lessThanOrEqualTo.now.toString()).to.be.equal('newData.val() <= now');
        });

        it('operation add', () => {
            expect(data.valNumber().add.newData.valNumber().toString()).to.be.equal('data.val() + newData.val()');
        });

        it('operation subtract', () => {
            expect(data.valNumber().subtract.newData.valNumber().toString()).to.be.equal('data.val() - newData.val()');
        });

        it('operation multiply', () => {
            expect(data.valNumber().multiply.newData.valNumber().toString()).to.be.equal('data.val() * newData.val()');
        });

        it('operation divide', () => {
            expect(data.valNumber().divide.newData.valNumber().toString()).to.be.equal('data.val() / newData.val()');
        });

        it('operation modulus', () => {
            expect(data.valNumber().modulus.newData.valNumber().toString()).to.be.equal('data.val() % newData.val()');
        });

    });

});
