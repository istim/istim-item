/**
 * TradeController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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

    list: function(req, res) {

        if (req.method !== 'GET')  return MethodNotAllowedException.fire(req, res, ['GET']);

        var query    = ['SELECT',
                        't.id, u.user_id, t.item_id, i.name, i.description, i.image',
                        'FROM Trade t',
                        'JOIN UserItem u',
                        'ON t.item_id = u.item_id',
                        'JOIN Item i',
                        'ON u.item_id = i.id',
                        'WHERE u.user_id != ' + req.session.user_id,
                        'AND t.alive = true',
                        'ORDER BY t.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

    trade: function(req, res) {

        if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('item_id'))  return MissingMandatoryParametersException.fire(req, res, ['item_id']);

        // verify if the item exists and already on trade
        UserItem.findOne(req.param('item_id'), function(err, userItem) {

            if (err)
                return res.send(err);
            if (!userItem)
                return InGameGenericError.fire(req, res, 'We could not found this item for trade.');
            if (userItem.user_id != req.session.user_id)
                return InGameGenericError.fire(req, res, 'You don\'t have this item.');

            Trade.findOne({item_id: req.param('item_id'), alive: 'true'}, function(err, trade) {

              if (err)
                  return res.send(err);
              if (trade)
                  return InGameGenericError.fire(req, res, 'You already list this item for trade.');

              // create the trade
              Trade.create({
                  user_id: req.session.user_id,
                  item_id: req.param('item_id')
              }).done(function(err, trade) {

                  if (err)
                      return res.send(err);
                  return res.send(trade);

              });

            });

        });

    },

    cancel: function(req, res) {

      if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
      if (!req.param('item_id'))  return MissingMandatoryParametersException.fire(req, res, ['item_id']);

      // verify if the trade exists
      Trade.findOne({item_id:req.param('item_id'), alive:true}, function(err, trade) {

        if (err)
            return res.send(err);
        if (!trade)
            return InGameGenericError.fire(req, res, 'We could not found this item for trade.');

        // verify if user owns the item
        UserItem.findOne(trade.user_id, function(err, userItem) {

          if (err)
              return res.send(err);
          if (userItem.user_id != req.session.user_id)
              return InGameGenericError.fire(req, res, 'You can\'t cancel a trade that doesn\'t belong to you.');

          // remove trade
          Trade.destroy({id:trade.id}).done(function(err) {

              if (err)
                  return res.send(err);
              return res.send(trade);

          });

        });

      });

    },

    accept: function(req, res) {

        if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
        if (!req.param('item_id'))  return MissingMandatoryParametersException.fire(req, res, ['item_id']);
        if (!req.param('trade_item_id'))  return MissingMandatoryParametersException.fire(req, res, ['trade_item_id']);

        // verify if item exists and has not been traded
        Trade.findOne({item_id:req.param('item_id'), trade_item_id:req.param('trade_item_id')}, function(err, trade) {

          if (err)
              return res.send(err);
          if (!trade)
              return InGameGenericError.fire(req, res, 'We could not found this trade.');
          if (trade.alive)
              return InGameGenericError.fire(req, res, 'This item has already been traded.');

          // verify if user owns the item
          UserItem.findOne(trade.item_id, function(err, userItem) {

            if (err)
                return res.send(err);
            if (useritem.user_id != req.session.user_id)
                return InGameGenericError.fire(req, res, 'You don\'t have this item to trade.');

            // verify if user owns the item offered
            UserItem.findOne(trade.trade_item_id, function(err, userItemOffered) {

              if (err)
                  return res.send(err);
              if (userItemOffered.user_id == req.session.user_id)
                  return InGameGenericError.fire(req, res, 'You can\'t to trade your own item with yourself.');

              var jsdate = new Date();
              var dbdate = jsdate.getFullYear() + '-' +
                          (jsdate.getMonth() < 9 ? '0' : '') + (jsdate.getMonth()+1) + '-' +
                          (jsdate.getDate() < 10 ? '0' : '') + jsdate.getDate() + ' ' + jsdate.getHours() + ':' +
                          jsdate.getMinutes() + ':' + jsdate.getSeconds();

              // update item sold_at timestamp
              Trade.update({id:trade.id}, {updated_at:dbdate}, {alive:false}, function(err, trades) {

                if (err)
                    return res.send(err);
                trades.updated_at = dbdate;

                var user_id = userItemOffered.user_id;

                // change items owner
                UserItem.update({id:userItemOffered.id}, {user_id:req.session.user_id}, function(err, useritem) {

                    if (err)
                        return res.send(err);

                    UserItem.update({id:userItem.id}, {user_id:user_id}, function(err, useritem) {

                      if (err)
                          return res.send(err);
                      res.send(trade);

                    });

                });

              });

            });

        });

      });

    },

    reject: function(req, res) {

      if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
      if (!req.param('item_id'))  return MissingMandatoryParametersException.fire(req, res, ['item_id']);
      if (!req.param('trade_item_id'))  return MissingMandatoryParametersException.fire(req, res, ['trade_item_id']);

      // verify if the trade exists
      Trade.findOne({item_id:req.param('item_id'), trade_item_id:req.param('trade_item_id'), alive:true}, function(err, trade) {

        if (err)
            return res.send(err);
        if (!trade)
            return InGameGenericError.fire(req, res, 'We could not found this trade.');

        // verify if user owns the item
        UserItem.findOne(trade.user_id, function(err, userItem) {

          if (err)
              return res.send(err);
          if (userItem.user_id != req.session.user_id)
              return InGameGenericError.fire(req, res, 'You can\'t cancel the trade that doesn\'t belong to you.');

          // remove the offer
          Trade.update({id:trade.id}, {trade_item_id:null}, function(err, tradeitem) {

            if (err)
                return res.send(err);
            res.send(tradeitem);

          });

        });

      });

    },

    offer_trade: function(req, res) {

      if (req.method !== 'POST')  return MethodNotAllowedException.fire(req, res, ['POST']);
      if (!req.param('item_id'))  return MissingMandatoryParametersException.fire(req, res, ['item_id']);
      if (!req.param('trade_item_id'))  return MissingMandatoryParametersException.fire(req, res, ['trade_item_id']);

      // verify if the trade exists
      Trade.findOne({item_id:req.param('item_id'), trade_item_id:null, alive:true}, function(err, trade) {

        if (err)
            return res.send(err);
        if (!trade)
            return InGameGenericError.fire(req, res, 'This trade has offer or doesn\'t exists.');

        // verify if user owns the item
        UserItem.findOne({item_id:req.param('trade_item_id')}, function(err, userItem) {

          if (err)
              return res.send(err);
          if (userItem.user_id != req.session.user_id)
              return InGameGenericError.fire(req, res, 'You can\'t to trade a item that you aren\'t the owner.');

          // do the offer
          Trade.update({id:trade.id}, {trade_item_id:req.param('trade_item_id')}, function(err, tradeItem) {

            if (err)
                return res.send(err);
            res.send(tradeItem);

          });

        });

      });

    },

    history: function(req, res) {

        if (req.method !== 'GET')  return MethodNotAllowedException.fire(req, res, ['GET']);

        var query    = ['SELECT',
                        't.trade_id, u.user_id, t.item_id, i.name, i.description, i.image',
                        'FROM Trade t',
                        'JOIN UserItem u',
                        'ON t.item_id = u.item_id',
                        'JOIN Item i',
                        'ON u.item_id = i.id',
                        'WHERE t.user_id = ' + req.session.user_id,
                        'AND t.alive = false',
                        'ORDER BY s.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

    list_offer: function(req, res) {

        if (req.method !== 'GET')  return MethodNotAllowedException.fire(req, res, ['GET']);

        var query    = ['SELECT',
                        't.trade_id, t.item_id, i.name, i.description, i.image, t.trade_item_id, i_offered.name name_item_offered, i_offered.description description_item_offered, i_offered.image image_item_offered', ,
                        'FROM Trade t',
                        'JOIN UserItem u',
                        'ON t.item_id = u.item_id',
                        'JOIN Item i',
                        'ON u.item_id = i.id',
                        'JOIN Item i_offered',
                        'ON t.trade_item_id = i_offered.id',
                        'WHERE t.user_id = ' + req.session.user_id,
                        'AND t.alive = true',
                        'ORDER BY s.createdAt ASC'].join(' ');

        var callBack = function(err, items) {
            if (err)
                return res.send(err);
            else
                return res.send(items);
        };

        return Item.query(query, callBack);

    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TradeController)
   */
  _config: {}


};
