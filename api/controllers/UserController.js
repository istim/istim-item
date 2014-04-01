/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    login: function(req, res) {

        if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('email'))  return MissingMandatoryParametersException.fire(req, res, ['email']);
        if (!req.param('password'))  return MissingMandatoryParametersException.fire(req, res, ['password']);

        var rest = require('restler');
        var options = {
            data: {
                email: req.param('email'),
                password: req.param('password')
            }
        };

        rest.post(
            'http://istim-user.nodejitsu.com/auth/login',
            options
        ).on('complete', function(data, response) {
            if (data.error) {
                res.send({error: true, message: data.error});
            }
            else {
                req.session.user = data;
                req.session.user_id = data.id;
                res.send({success: true, user: data})
            }
        });

    },

    logout: function(req, res) {

        req.session.user_id = null;
        res.send({user_id: null});

    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to UserController)
    */
    _config: {
        blueprints: {
            rest: false,
            shortcuts: true
        }
    }

};
