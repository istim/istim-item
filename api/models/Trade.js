/**
 * Trade
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    /*
    useritem_id: {
        type: 'integer',
        required: true
    },
    */

    user_id: {
        type: 'string',
        required: true
    },

    item_id: {
        type: 'integer',
        required: true
    },

    trade_item_id: {
        type: 'integer'
    },

    accepted: {
        type: 'boolean',
        defaultsTo: false
    },

    alive: {
        type: 'boolean',
        defaultsTo: true
    },

  }

};
