'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Country Schema
 */
 var CountrySchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  _sort: {
    type: Number
  },
  country_code: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  currency_code: {
    type: String,
    trim: true
  },
  euro_conv_rate: {
    type: Number,
    trim: true
  },
  row_insert_date: {
    type: Date
  },
  state: [{
    title: String
  }],
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
});

 mongoose.model('Country', CountrySchema);
