/**
 * AuthHelper
 *
 * @module      :: Services
 * @description :: Simulates login
 */

module.exports = {

    isAuthenticated: function(req) {

        var rest = require('restler');
        var userId = false;
        var authenticated = false;

        if (req.session.user_id) userId = req.session.user_id;
        if (req.param.user_id) userId = req.param.user_id;
        console.log(userId);
        console.log(req.session.user_id);

        if (userId) {
            console.log('entrou');

            var options = {
                data: {
                    userId: userId
                }
            };

            rest.post(
                'http://istim-user.jit.su/authenticated',
                options
            ).on('complete', function(data, response) {
                if (data.authenticated == 'no') {
                    authenticated = false;
                } else {
                    authenticated = true;
                }
            });

        }
    }

};