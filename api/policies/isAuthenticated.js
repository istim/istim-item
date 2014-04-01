/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    var rest = require('restler');
    var userId = false;
    var authenticated = false;

    if (req.query.user_id) userId = req.query.user_id;
    if (req.session.user_id) userId = req.session.user_id;

    if (userId) {

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
                return UnauthorizedException.fire(req, res);
            } else {
                return next();
            }
        });

    } else {
        return UnauthorizedException.fire(req, res);
    }

};
