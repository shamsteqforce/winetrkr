'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Cellers Schema
 */
 var CellarsSchema = new Schema({
  cellar_name: {
    type: String,
    required: 'Celler Name cannot be blank',
    trim: true,
    unique:true
  },
  address_line1: {
    type: String,
    default: '',
    trim: true
  },
  address_line2: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  postcode: {
    type: Number,
  },
  country: {
    type: String,
    default: '',
    trim: true
  },

    users : [{
    user_id: {
    type: Schema.ObjectId,
    ref: 'User'
  }  
  }],


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

 mongoose.model('Cellar', CellarsSchema);
