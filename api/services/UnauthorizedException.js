/**
 * UnauthorizedException
 *
 * @module      :: Services
 * @description :: Thrown when user tries to reach an URL that requires,
 *                 authentication and there is no session defined.
 */

module.exports = {

    fire: function(req, res, code) {
        var error = {
            error: true,
            type: 'UnauthorizedException',
            message: 'You need to login to access this page.'
        };

        res.statusCode = res.statusCode = typeof code !== 'undefined' ? code : 400;
        return res.send(error);
    }

};