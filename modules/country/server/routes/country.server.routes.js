'use strict';

/**
 * Module dependencies.
 */
var countryPolicy = require('../policies/country.server.policy'),
  country = require('../controllers/country.server.controller');

module.exports = function (app) {
  // country collection routes
  app.route('/api/country').all(countryPolicy.isAllowed)
    .get(country.list)
    .post(country.create);

  // Single country routes
  app.route('/api/country/:countryId').all(countryPolicy.isAllowed)
    .get(country.read)
    .put(country.update)
    .delete(country.delete);

     app.route('/api/country/:countryId/:stateId').all(countryPolicy.isAllowed)
    .get(country.findOneState)
    .put(country.updateCountryState);


    

  // Finish by binding the country middleware
  app.param('countryId', country.countryByID);
};
