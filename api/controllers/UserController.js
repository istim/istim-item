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

        if (req.method != 'POST') {
            res.statusCode = 400;
            return res.send({error: true, type: 'BadRequestError', message: 'Invalid request method, must use POST.'});
        }

        if ( ! req.param('user_id')) {
            res.statusCode = 400;
            return res.send({error: true, type: 'MissingParameterError', message: 'You did not specify an user.'});
        }

        req.session.user_id = req.param('user_id');
        res.send({user_id: req.param('user_id')});

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
