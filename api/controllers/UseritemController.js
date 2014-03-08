/**
 * UseritemController
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

    mine: function(req, res) {

        if (req.method !== 'GET') return MethodNotAllowedException.fire(req, res, ['GET']);
        if (!req.session.user_id) return UnauthorizedException.fire(req, res);

        var query    = ['SELECT',
                        'u.id as id, i.id as item_id, i.name, i.price,',
                        'i.image, u.createdAt, u.updatedAt',
                        'FROM Item i',
                        'JOIN UserItem u',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id = ' + req.session.user_id,
                        'ORDER BY u.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    }

};
