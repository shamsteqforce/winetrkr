'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var WinePriceSchema = new Schema({
  wine_id: {
    type: String,
    trim: true
  },
  price_date: {
    type: Date
  },
  price_source: {
    type: String,
    trim: true
  },
  price: {
    type: Number
  },

 purchase_date: {
    type: Date
  },
  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  
  created_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

 mongoose.model('WinePrice', WinePriceSchema);
