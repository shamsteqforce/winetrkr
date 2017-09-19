'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var HistoricPositionSchema = new Schema({
  wine_id: {
    type: String,
    trim: true
  },
  
  purchase_date: {
    type: Date
  },

   purchase_date_string: {
    type: String
  },
  
  quantity: {
    type: Number
  },
  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  wines: {
    type: Schema.ObjectId,
    ref: 'Wine'
  },

  score: {
    type: Number   
    
  },

  avg_cost_price: {
    type: Number
  },


  bottle_properties:{
    cork_condition: String,
    fill_level: String,
    label_condition: String
  },

   cellar_id: {
    type: Schema.ObjectId,
    ref: 'Cellar'
  },

  delivery_status:
  {
    type: String
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

 mongoose.model('HistoricPositions', HistoricPositionSchema);
