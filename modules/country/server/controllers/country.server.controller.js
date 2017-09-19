'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Country = mongoose.model('Country'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a country
 */
 exports.create = function (req, res) {
  var country = new Country(req.body);
  country.user = req.user;

  country.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * Show the current country
 */
 exports.read = function (req, res) {
  res.json(req.country);
};

/**
 * Update a country
 */
 exports.update = function (req, res) {
  var country = req.country;

  country._sort = req.body._sort;
  country.state = req.body.state;

  country.title = req.body.title;
  country.country_code = req.body.country_code;
  country.currency = req.body.currency;
  country.currency_code = req.body.currency_code;
  country.euro_conv_rate = req.body.euro_conv_rate;

  country.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * Delete an country
 */
 exports.delete = function (req, res) {
  var country = req.country;

  country.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * List of country
 */
 exports.list = function (req, res) {
  Country.find().sort({ _sort:1,title: 1 }).populate('user', 'email').exec(function (err, country) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * Country middleware
 */
 exports.countryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'country is invalid'
    });
  }

  Country.findById(id).populate('user', 'displayName').exec(function (err, country) {
    if (err) {
      return next(err);
    } else if (!country) {
      return res.status(404).send({
        message: 'No country with that identifier has been found'
      });
    }
    req.country = country;
    next();
  });
};


exports.findOneState = function (req, res) {
  var countryId = req.param('countryId');
  var stateId = req.param('stateId');
  console.log(stateId);

  Country.findOne({ _id: countryId }).exec(function (err, result) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      console.log(result.state.id(stateId));
      // result.state._id(stateId);
      res.json(result.state.id(stateId));
      
    }
  });
};

exports.updateCountryState = function (req, res) {
  var countryId = req.param('countryId');
  var stateId = req.param('stateId');
  var title = req.body.title;


  Country.findOne({ _id: countryId }).exec(function (err, result) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      result.state.id(stateId).title=title;

      result.save(function (err) {
        if (err) {
          console.log(err);

          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(result);
        }
      }); 
    }
  });

};