/**
 * InGameGenericError
 *
 * @module      :: Services
 * @description :: Thrown when something is not right with the action inside
 *                 the game
 */

module.exports = {

    fire: function(req, res, message, code) {
        var error = {
            error: true,
            type: 'InGameGenericError',
            message: message
        };

        res.statusCode = typeof code !== 'undefined' ? code : 200;
        return res.send(error);
    }

};