'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

 var PositionSchema = new Schema({
  wine_id: {
    type: Schema.ObjectId,
    required: 'Wine Id cannot be blank',
    ref: 'Wine'
  },
  cellar_id: {
    type: Schema.ObjectId,
    ref: 'Cellar'
  },
  quantity: {
    type: Number
  },
  score: {
    type: Number   
    
  },
  avg_cost_price: {
    type: Number
  },
  avg_market_price: {
    type: Number
  },
  bottle_properties:{
    cork_condition: String,
    fill_level: String,
    label_condition: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },

  purchase_date: {
    type: Date
  },

  delivery_status:
  {
    type: String
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

 mongoose.model('Position', PositionSchema);
