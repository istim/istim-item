/**
 * ItemController
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

        if ( ! req.session.user_id) {
            res.statusCode = 400;
            return res.send({error: true, type: 'NotAuthorizedError', message: 'You are not authorized to access this page.'});
        }

        if (req.method != 'POST') {
            res.statusCode = 400;
            return res.send({error: true, type: 'BadRequestError', message: 'Invalid request method, must use POST.'});
        }

        var query    = ['SELECT',
                        'item_id as id, i.name, i.price, i.image,',
                        'u.createdAt, u.updatedAt',
                        'FROM Item i',
                        'JOIN UserItem u',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id = ' + req.session.user_id,
                        'ORDER BY u.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err) res.send(err);
            else res.send(items);
        };

        var items = Item.query(query, callBack);

    }

};
