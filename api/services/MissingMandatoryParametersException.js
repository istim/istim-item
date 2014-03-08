/**
 * MissingMandatoryParametersException
 *
 * @module      :: Services
 * @description :: Thrown when trying to reach an URL with missing mandatory
 *                 parameters.
 */

module.exports = {

    fire: function(req, res, params, code) {
        var error = {
            error: true,
            type: 'MissingMandatoryParametersException',
            message: 'Some mandatory parameters are missing (' + params.join(', ') +  ').'
        };

        res.statusCode = typeof code !== 'undefined' ? code : 400;
        return res.send(error);
    }

};