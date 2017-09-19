'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

 var ReceiptSchema = new Schema({
  wine_id: {
    type: String  
    
  },
 
  name: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
 tags:[],
  file_path:{
    type:String
  },
  transaction_id:[],
  created_at: {
    type: Date,
    default: Date.now
  }, 
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

 mongoose.model('Receipt', ReceiptSchema);