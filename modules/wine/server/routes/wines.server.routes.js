'use strict';

/**
 * Module dependencies.
 */
var winesPolicy = require('../policies/wines.server.policy'),
  wines = require('../controllers/wines.server.controller');

module.exports = function (app) {
  // wines collection routes
  app.route('/api/wine').all(winesPolicy.isAllowed)
    .get(wines.list)
    .put(wines.update)
    .post(wines.create);

   app.route('/api/wine/search/:q').all(winesPolicy.isAllowed)
    .get(wines.searchWine);

    app.route('/api/wine/find/grape-variety').all(winesPolicy.isAllowed)
    .get(wines.getGrapeVariety);

     app.route('/api/wine/find/source-supplier').all(winesPolicy.isAllowed)
    .get(wines.getSourceSupplier);

    app.route('/api/wine/find/unique-wine').all(winesPolicy.isAllowed)
    .get(wines.getWinelist);
    app.route('/api/wine/find/unique-producer').all(winesPolicy.isAllowed)
    .get(wines.getProducerlist);
    app.route('/api/wine/find/producer-location').all(winesPolicy.isAllowed)
    .post(wines.getProducerLocation);
    app.route('/api/wine/find/winesAveragePrice').all(winesPolicy.isAllowed)
    .post(wines.getAverageWinePrice);

    /* routes for graphs */
    app.route('/api/wine/get/winesAveragePriceMonthWise').all(winesPolicy.isAllowed)
    .post(wines.getAverageWinePriceLastSixMonthsWise);

     app.route('/api/wine/get/winesAverageBottlesMonthWise').all(winesPolicy.isAllowed)
    .post(wines.getAverageWineBottleLastSixMonthsWise);

    app.route('/api/wine/get/countryGraph').all(winesPolicy.isAllowed)
    .post(wines.getCountryGraphData);

    app.route('/api/wine/get/varietalGraph').all(winesPolicy.isAllowed)
    .post(wines.getVarietalGraphData);

    app.route('/api/wine/get/verticalGraph').all(winesPolicy.isAllowed)
    .post(wines.getVerticalGraphData);

    app.route('/api/wine/get/producerGraph').all(winesPolicy.isAllowed)
    .post(wines.getProducersGraphData);

    app.route('/api/wine/get/regionGraph').all(winesPolicy.isAllowed)
    .post(wines.getRegionBottleData);

    app.route('/api/wine/get/wineByUser').all(winesPolicy.isAllowed)
    .post(wines.getWineByUser);

     app.route('/api/wine/get/vintageGraph').all(winesPolicy.isAllowed)
    .post(wines.getVintagesGraphData);

    app.route('/api/wine/get/topDistributors').all(winesPolicy.isAllowed)
    .post(wines.getTopDistributors);

    app.route('/api/wine/get/totalDistributionPrice').all(winesPolicy.isAllowed)
    .post(wines.getTotalDistributionPrice);

/* add for receipt*/
    app.route('/api/receipt/new').all(winesPolicy.isAllowed)
    .post(wines.addReceipt);
     app.route('/api/receipt/delete').all(winesPolicy.isAllowed)
    .post(wines.deleteReceipt);
     app.route('/api/get/receipt').all(winesPolicy.isAllowed)
     .get(wines.getReceiptList);
     
      app.route('/api/wine/get/lastTransaction').all(winesPolicy.isAllowed)
    .post(wines.getLastTransactions);

    app.route('/api/transaction/new').all(winesPolicy.isAllowed)
    .post(wines.postTransaction);

    app.route('/api/transaction/remove').all(winesPolicy.isAllowed)
    .post(wines.postDrTransaction);

    app.route('/api/transaction/delete').all(winesPolicy.isAllowed)
    .post(wines.deleteWineTransaction);

    app.route('/api/get/expenditure').all(winesPolicy.isAllowed)
    .get(wines.getExpenditure);

     app.route('/api/get/transaction').all(winesPolicy.isAllowed)
    .get(wines.getTransactionList);

    app.route('/api/get/inventoryQty').all(winesPolicy.isAllowed)
    .get(wines.getInventoryQty);

    app.route('/api/get/fxrate-update').all(winesPolicy.isAllowed)
    .post(wines.fxRatesUpdate);

    app.route('/api/get/fxrate').all(winesPolicy.isAllowed)
    .get(wines.getFxRates);

    app.route('/api/position/getPositionbyId/:wineId').all(winesPolicy.isAllowed)
    .get(wines.getPositionbyId);

 app.route('/api/position/score').all(winesPolicy.isAllowed)
    .put(wines.updatescore);
  

  app.route('/api/wine/rating').all(winesPolicy.isAllowed)
    .put(wines.updateRatings);

    app.route('/api/position/getPositionScorebyId').all(winesPolicy.isAllowed)
    .put(wines.getPositionScorebyId);
   
 app.route('/api/position/getAvgCommunity').all(winesPolicy.isAllowed)
    .put(wines.getAvgCommunity);


    

  // Single wine routes
  app.route('/api/wine/:wineId').all(winesPolicy.isAllowed)
    .get(wines.read)
    .put(wines.update)
    .delete(wines.delete);

  // Finish by binding the wine middleware
  app.param('wineId', wines.wineByID);
};
