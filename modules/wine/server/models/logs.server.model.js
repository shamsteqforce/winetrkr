'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var LogSchema = new Schema({
  entry_date: {
    type: Date,
    default: Date.now
  },
  details:{},
  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

 mongoose.model('Log', LogSchema);
