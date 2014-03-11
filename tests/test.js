/**
 * API Testing
 *
 * @module      :: Mocha
 * @description :: Test API routes and actions.
 */

var Sails    = require('sails');
var assert   = require('assert');
var request  = require('supertest');

/**
 * Bootstrap the server
 */
var app;
before(function(done) {
    this.timeout(5000);

    Sails.lift({

        log: {
            level: 'error'
        },

        adapters: {
            mysql: {
                module: 'sails-mysql',
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'istim-item'
            }
        },
    }, function(err, sails) {
        app = sails;
        done(err, sails);
    });
});

/**
 * Test Cases: UserController
 */
describe('UserController', function() {
    describe('#login()', function() {
        it('deve retornar erro caso seja feita uma requisição GET', function(done) {
            request(app.express.app).get('/user/login').expect(405).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MethodNotAllowedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o id do usuário não seja passado', function(done) {
            request(app.express.app).post('/user/login').expect(400, function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MissingMandatoryParametersException', res.body.type);
                done();
            });
        });
        it('deve retornar o objeto usuário se for post e setado o id do usuário', function(done) {
            request(app.express.app).post('/user/login').send({user_id:1}).expect(200, function(err, res) {
                assert.equal(1, res.body.user_id);
                done();
            });
        });
    });
    describe('#logout()', function() {
        it('deve retornar um usuário vazio em qualquer caso', function(done) {
            request(app.express.app).get('/user/logout').expect(200).end(function(err, res) {
                assert.equal(null, res.body.user_id);
                done();
            });
        });
    });
});
