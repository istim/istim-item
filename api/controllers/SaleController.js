/**
 * SaleController
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

    for_sale: function(req, res) {

        if (req.method !== 'GET')  return MethodNotAllowedException.fire(req, res, ['GET']);

        var query    = ['SELECT',
                        's.id, u.user_id, i.name, i.description,',
                        'i.price, i.image, s.createdAt, s.updatedAt',
                        'FROM Sale s',
                        'JOIN UserItem u',
                        'ON s.useritem_id = u.id',
                        'JOIN Item i',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id != \'' + req.session.user_id + '\'',
                        'AND s.sold_at IS NULL',
                        'ORDER BY s.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

    selling: function(req, res) {

        if (req.method !== 'GET')  return MethodNotAllowedException.fire(req, res, ['GET']);

        var query    = ['SELECT',
                        's.id, u.user_id, i.name, i.description,',
                        'i.price, i.image, s.createdAt, s.updatedAt',
                        'FROM Sale s',
                        'JOIN UserItem u',
                        'ON s.useritem_id = u.id',
                        'JOIN Item i',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id != \'' + req.session.user_id + '\'',
                        'AND s.sold_at IS NULL',
                        'ORDER BY s.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

    buy: function(req, res) {

        if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('sale_id'))  return MissingMandatoryParametersException.fire(req, res, ['sale_id']);

        // verify if sale exists and has not been sold
        Sale.findOne({id:req.param('sale_id')}, function(err, sale) {
            if (err)
                return res.send(err);
            if (!sale)
                return InGameGenericError.fire(req, res, 'We could not found this item for sale.');
            if (sale.sold_at)
                return InGameGenericError.fire(req, res, 'This item has already been sold.');

            // verify if user owns the item
            UserItem.findOne(sale.useritem_id, function(err, useritem) {

                if (err)
                    return res.send(err);
                if (useritem.user_id == req.session.user_id)
                    return InGameGenericError.fire(req, res, 'You can not buy your own item.');

                var jsdate = new Date();
                var dbdate = jsdate.getFullYear() + '-' +
                            (jsdate.getMonth() < 9 ? '0' : '') + (jsdate.getMonth()+1) + '-' +
                            (jsdate.getDate() < 10 ? '0' : '') + jsdate.getDate() + ' ' + jsdate.getHours() + ':' +
                            jsdate.getMinutes() + ':' + jsdate.getSeconds();

                // update item sold_at timestamp
                Sale.update({id:sale.id}, {sold_at:dbdate}, function(err, sales) {

                    if (err)
                        return res.send(err);
                    sale.sold_at = dbdate;

                    // change item owner
                    UserItem.update({id:useritem.id}, {user_id:req.session.user_id}, function(err, useritem) {

                        if (err)
                            return res.send(err);
                        res.send(sale);

                    });

                });

            });

        });

    },

    sell: function(req, res) {

        if (req.method !== 'POST')      return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('useritem_id'))  return MissingMandatoryParametersException.fire(req, res, ['useritem_id']);


        // verify if user has item
        UserItem.findOne(req.param('useritem_id'), function(err, item) {

            if (err)
                return res.send(err);
            if (!item)
                return InGameGenericError.fire(req, res, 'You can\'t sell an item you don\'t have.');

            // verify if item is already listed for sale
            Sale.findOne({useritem_id: req.param('useritem_id'), sold_at: null}, function(err, sale) {

                if (err)
                    return res.send(err);
                if (sale)
                    return InGameGenericError.fire(req, res, 'You already listed this item for sale.');

                // create the sale
                Sale.create({
                    useritem_id: req.param('useritem_id'),
                    sold_at: null
                }).done(function(err, sale) {

                    if (err)
                        return res.send(err);
                    return res.send(sale);

                });

            });


        });

    },

    cancel: function(req, res) {

        if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('sale_id'))  return MissingMandatoryParametersException.fire(req, res, ['sale_id']);

        // verify if sale exists
        Sale.findOne({id:req.param('sale_id'), sold_at:null}, function(err, sale) {

            if (err)
                return res.send(err);
            if (!sale)
                return InGameGenericError.fire(req, res, 'We could not found this item for sale.');

            // verify if user owns the item
            UserItem.findOne(sale.useritem_id, function(err, useritem) {

                if (err)
                    return res.send(err);
                if (useritem.user_id != req.session.user_id)
                    return InGameGenericError.fire(req, res, 'You can\'t cancel a sale that doesn\'t belong to you.');

                // remove sale
                Sale.destroy({id:sale.id}).done(function(err) {

                    if (err)
                        return res.send(err);
                    return res.send(sale);

                });

            });

        });

    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SaleController)
     */
    _config: {}


};
