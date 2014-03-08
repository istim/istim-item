/**
 * MethodNotAllowedException
 *
 * @module      :: Services
 * @description :: Thrown when trying to reach an URL with a forbidden method.
 */

module.exports = {

    fire: function(req, res, methods, code) {
        var error = {
            error: true,
            type: 'MethodNotAllowedException',
            message: 'No route found for "' + req.method + ' ' + req.url + '" (Allow: ' + methods.join(', ') + ').'
        };

        res.statusCode = typeof code !== 'undefined' ? code : 405;
        return res.send(error);
    }

};