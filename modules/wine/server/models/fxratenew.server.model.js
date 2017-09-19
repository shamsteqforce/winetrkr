'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var FxratenewSchema = new Schema({
  entry_date: {
    type: Date,
    default: Date.now
  },
  rate:{
    type: String,
    required: 'Rate cannot be blank'
  },
 code:{
   type: String,
    required: 'Country code cannot be blank'
 }

});

 mongoose.model('Fxratenew', FxratenewSchema);
