'use strict';


/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Wine Schema
 */
 var WineSchema = new Schema({
  producer: {
    type: String,
    required: 'Producer cannot be blank',
    trim: true
  },
  wine_name: {
    type: String,
    trim: true,
    required: 'Wine Name cannot be blank'
  },
  vintage_year: {
    type: String,
    required: 'Vintage year cannot be blank',
    trim: true
  },
  bottle_size: {
    type: String,
    required: 'Bottle Size cannot be blank',
    trim: true
  },

  /*
  drinking_window: {
    type: String,
    required: 'Drinking window cannot be blank',
    trim: true
  },
  */
  country_code: {
    type: String,
    required: 'Country cannot be blank',
    trim: true
  },
  wine_varietal: {
    type: String,
    trim: true
  },
  grape_varietal: [{
    name: String,
    value: String
  }],
  
  classification: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  sub_region: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  // quantity: {
  //   type: Number,
  //   trim: true,
  //   default:0
  // },
  // cost_per_bottle: {
  //   type: Number,
  //   trim: true
  // },
  // currency: {
  //   type: String,
  //   trim: true
  // },
  
  // fill_level: {
  //   type: String,
  //   trim: true
  // },
  // level_condition: {
  //   type: String,
  //   trim: true
  // },

  // cork_condition: {
  //   type: String,
  //   trim: true
  // },
  // source_supplier: {
  //   type: String,
  //   trim: true
  // },
  // delivery_status: [{
  //   date: Date,
  //   status: String,
  //   delivered: {
  //     name: String,
  //     address: String,
  //     city: String,
  //     country: String,
  //     post_code: String
  //   }
  // }],

  // cellar_location: {
  //   type: String,
  //   trim: true
  // },

  // purchase_date: {
  //   type: Date,
  //   trim: true
  // },
  // sub_region: {
  //   type: String,
  //   trim: true
  // },
  // sub_region: {
  //   type: String,
  //   trim: true
  // },
  // wine_varietal: {
  //   type: String,
  //   trim: true
  // },
  ratings: {
    type: String,
    trim: true
  },
  tasting_notes: {},
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

 mongoose.model('Wine', WineSchema);
