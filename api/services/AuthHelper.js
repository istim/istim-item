/**
 * AuthHelper
 *
 * @module      :: Services
 * @description :: Simulates login
 */

module.exports = function(req) {
    if (req.query.login) {
        if (req.query.login === 0) {
            req.session.user_id = null;
        } else {
            req.session.user_id = req.query.login;
        }
    }
};