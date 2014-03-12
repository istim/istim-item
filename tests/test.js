/**
 * API Testing
 *
 * @module      :: Mocha
 * @description :: Test API routes and actions.
 */

var Sails    = require('sails');
var assert   = require('assert');
var request  = require('supertest');
var should   = require('should');

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

/**
 * Test Cases: UserItemController
 */
describe('UserItemController', function() {
    describe('#mine()', function() {
        it('deve retornar erro caso seja feita uma requisição POST', function(done) {
            request(app.express.app).post('/useritem/mine').expect(405).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MethodNotAllowedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o usuário não esteja logado', function(done) {
            request(app.express.app).get('/useritem/mine').end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('UnauthorizedException', res.body.type);
                done();
            });
        });
        it('deve retornar uma lista de itens que o usuário possui', function(done) {
            request(app.express.app).get('/useritem/mine?login=1').end(function(err, res) {
                res.body.should.be.instanceOf(Array).and.should.not.be.empty;
                done();
            });
        });
        it('deve retornar uma lista vazio para um usuário sem itens', function(done) {
            request(app.express.app).get('/useritem/mine?login=2').end(function(err, res) {
                res.text.should.be.equal('[]');
                done();
            });
        });
    });
});

/**
 * Test Cases: SaleController
 */
describe('SaleController', function() {
    describe('#for_sale()', function() {
        it('deve retornar erro caso seja feita uma requisição POST', function (done) {
            request(app.express.app).post('/sale/for_sale').expect(405).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MethodNotAllowedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o usuário não esteja logado', function(done) {
            request(app.express.app).get('/sale/for_sale').end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('UnauthorizedException', res.body.type);
                done();
            });
        });
        it('deve retornar uma lista vazia para usuário que não pode comprar nada', function(done) {
            request(app.express.app).get('/sale/for_sale?login=1').end(function(err, res) {
                res.text.should.be.equal('[]');
                done();
            });
        });
        it('deve retornar uma lista de itens a venda quando o usuário pode comprar', function(done) {
            request(app.express.app).get('/sale/for_sale?login=2').end(function(err, res) {
                res.body.should.be.instanceOf(Array);
                done();
            });
        });
    });
    describe('#selling()', function() {
        it('deve retornar erro caso seja feita uma requisição POST', function (done) {
            request(app.express.app).post('/sale/selling').expect(405).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MethodNotAllowedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o usuário não esteja logado', function(done) {
            request(app.express.app).get('/sale/selling').end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('UnauthorizedException', res.body.type);
                done();
            });
        });
        it('deve retornar a lista de itens que o usuário está vendendo', function(done) {
            request(app.express.app).get('/sale/selling?login=1').end(function(err, res) {
                res.body.should.be.instanceOf(Array);
                done();
            });
        });
        it('deve retornar uma lista vazio para quem não está vendendo nada', function(done) {
            request(app.express.app).get('/sale/selling?login=2').end(function(err, res) {
                res.text.should.be.equal('[]');
                done();
            });
        });
    });
    describe('#buy()', function() {
        it('deve retornar erro caso seja feita uma requisição GET', function (done) {
            request(app.express.app).get('/sale/buy').expect(405).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MethodNotAllowedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o usuário não esteja logado', function(done) {
            request(app.express.app).post('/sale/buy').end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('UnauthorizedException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso o usuário não especifique qual a compra', function(done) {
            request(app.express.app).post('/sale/buy?login=2').end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('MissingMandatoryParametersException', res.body.type);
                done();
            });
        });
        it('deve retornar erro caso não exista o item procurado', function(done) {
            request(app.express.app).post('/sale/buy?login=2').send({sale_id:394}).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('InGameGenericError', res.body.type);
                res.body.message.should.containEql('not found');
                done();
            });
        });
        it('deve retornar erro caso o item já tenha sido comprado', function(done) {
            request(app.express.app).post('/sale/buy?login=2').send({sale_id:4}).end(function(err, res) {
                assert.ok(res.body.error);
                assert.equal('InGameGenericError', res.body.type);
                res.body.message.should.containEql('already been sold');
                done();
            });
        });
        // it('deve retornar uma lista vazio para quem não está vendendo nada', function(done) {
        //     request(app.express.app).get('/sale/buy?login=2').end(function(err, res) {
        //         res.text.should.be.equal('[]');
        //         done();
        //     });
        // });
    });
});

/**
 * Lower sails
 */
after(function(done) {
    app.lower(done);
});