'use strict';

/**
 * Module dependencies.
 */
var cellersPolicy = require('../policies/cellers.server.policy'),
  cellers = require('../controllers/cellers.server.controller');

module.exports = function (app) {
  // cellers collection routes
  app.route('/api/cellers').all(cellersPolicy.isAllowed)
    .get(cellers.list)
    .post(cellers.create);


  
  // Single article routes
  app.route('/api/cellers/:articleId').all(cellersPolicy.isAllowed)
    .get(cellers.read)
    .put(cellers.update)
    .delete(cellers.delete);

    app.route('/api/cellers/find/cellar-details').all(cellersPolicy.isAllowed)
    .post(cellers.getCellarDetails);

     app.route('/api/cellers/find/my-cellars').all(cellersPolicy.isAllowed)
    .post(cellers.getMyCellars);

  // Finish by binding the article middleware
  app.param('articleId', cellers.articleByID);
};
