// write mocha tests for index.js
const assert = require('assert');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { signin, isAuthenticated } = require('../index');

let result;

const password = '123';
const incorrectPassword = '234';

const _id = crypto.randomBytes(24).toString('hex');
const user = {
    _id,
    username: "test123",
}

const pretest = async (user, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const expiresIn = "1d";
    user.password = hashedPassword;
    result = await signin(user, password, expiresIn);
    console.log(result);
}


describe('Correct User Details', function() {
    describe('#signin()', function() {
        it('should return an object --expected delay',async function() {
            await pretest(user, password);
            assert.equal(typeof result, 'object');
        });
        it('should return a success', function() {
            assert.equal(result.status, "success");
        });
        it('should return a token', function() {
            assert.equal(result.token.length, 232);
        });
        it('should return a user', function() {
            assert.equal(result.data.user.username, "test123");
        });
    });
    describe('#isAuthenticated()', function() {
        it('should return object', function() {
            const token = result.token;
            const isAuthenticatedResult = isAuthenticated(token);
            assert.equal(typeof isAuthenticatedResult, 'object');
        })
        it('should return user', function() {
            const token = result.token;
            const isAuthenticatedResult = isAuthenticated(token);
            assert.equal(isAuthenticatedResult.username, 'test123');
        })
    });
});

describe('In-correct User Details', function() {
    describe('#signin()', function() {
        it('should return an undefined --expected delay',async function() {
            await pretest(user, incorrectPassword);
            assert.equal(typeof result, undefined);
        });
    });
    describe('#isAuthenticated()', function() {
        it('should return undefined', function() {
            const token = result.token;
            const isAuthenticatedResult = token ? isAuthenticated(token) :  undefined;
            assert.equal(typeof isAuthenticatedResult, undefined);
        })
    });
});