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

        if (req.method == 'GET') return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('user_id'))  return MissingMandatoryParametersException.fire(req, res, ['user_id']);

        var query    = ['SELECT',
                        'u.id as id, i.id as item_id, i.name, i.price,',
                        'i.image, u.createdAt, u.updatedAt',
                        'FROM Item i',
                        'JOIN UserItem u',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id = \'' + req.param('user_id') + '\'',
                        'ORDER BY u.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

    sell: function(req, res) {

        if (req.method == 'GET') return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('user_id'))  return MissingMandatoryParametersException.fire(req, res, ['user_id']);
        if (!req.param('useritem_id'))  return MissingMandatoryParametersException.fire(req, res, ['useritem_id']);

        UserItem.findOne(req.param('useritem_id'), function(err, user_item) {

            if (err)
                return res.send(err);
            if (!user_item)
                return InGameGenericError.fire(req, res, 'You can\'t sell an item you don\'t have.');
            if (user_item.user_id != req.param('user_id'))
                return InGameGenericError.fire(req, res, 'You can\'t sell an item you don\'t have.');

            var create_url = 'http://istimcoinvirtual.jit.su/coin/create?userId=';
            var show_url = 'http://istimcoinvirtual.jit.su/coin/show?userId=';
            var credit_url = 'http://istimcoinvirtual.jit.su/coin/credit?userId=';
            create_url += req.param('user_id');
            show_url += req.param('user_id');
            credit_url += req.param('user_id') + '&cash=';

            var rest = require('restler');
            rest.get(create_url).on('complete', function(create, create_response) {
                Item.findOne(user_item.item_id, function(err, item) {
                    rest.get(credit_url + item.price).on('complete', function(credit, credit_response) {
                        UserItem.destroy({id: req.param('useritem_id')}).done(function(err) {
                            if (err)
                                return res.send(err)
                            return res.send(credit);
                        });
                    });
                });
            });

        });

    }

};
