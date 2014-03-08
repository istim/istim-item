/**
 * Sale
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    useritem_id: {
        type: 'integer',
        required: true
    },

    sold_at: {
        type: 'date'
    },

  }

};
