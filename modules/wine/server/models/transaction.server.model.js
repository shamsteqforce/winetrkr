'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var TransactionSchema = new Schema({
  wine_id: {
    type: String,
    required: 'Winw Id cannot be blank',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: 'Date cannot be blank'
  },
  cellar_id: {
    type: String,   
    trim: true
  },
  order_tax: {
    type: String,
    trim: true
  },
  order_shipping: {
    type: String,
    trim: true
  },
  region:String,
  source_supplier:String,
  country:String,
  owc:String,
  details : [{
    bottle_size: String,
    qty: Number,
    price: Number,
    currency: String,
    price_usd: Number
  }],

  attach_receipts : [{
    file_path: String,
  }],
  purchase_date: {
    type: Date,
    trim: true
  },
  delivery_status: [{
    date: Date,
    status: String,
    delivered: {
      name: String,
      address: String,
      city: String,
      country: String,
      post_code: String
    }
  }],

  label_condition : {
    type: String,
    trim: true
  },
  cork_condition: {
    type: String,
    trim: true
  },
  bottle_price_clean: {
    type: String,
    trim: true
  },
  transaction_type: {
    type: String,
    trim: true
  },
  source_of_wine: {
    type: String,
    trim: true
  },
  
  notes_about_transaction: {
    type: String,
    optional: true
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

  
});

 mongoose.model('Transaction', TransactionSchema);
