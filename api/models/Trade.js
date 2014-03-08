/**
 * Trade
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    useritem_id_from: {
        type: 'integer',
        required: true
    },

    useritem_id_to: {
        type: 'integer',
        required: true
    },

    accepted: {
        type: 'boolean',
        defaultsTo: false
    },

  }

};
