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

    sell: function(req, res) {

        if (req.method !== 'POST')      return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.session.user_id)       return UnauthorizedException.fire(req, res);
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
                    return InGameGenericError.fire(req, res, 'You already list this item for sale.');

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


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SaleController)
     */
    _config: {}


};
