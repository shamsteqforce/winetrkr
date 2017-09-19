'use strict';


var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Receipt=mongoose.model('Receipt'),
  User = mongoose.model('User');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
/**
 * add receipt
 */
exports.addReceipt = function (req, res) {
  console.log("receipt "+req)
  var receipt =new Receipt();
  // console.log("receipt "+config.uploads.receiptUpload.dest + req.file.filename)
  var message = null;
  var upload = multer(config.uploads.receiptUpload).single('newReceipt');
  var receiptUploadFileFilter = require(path.resolve('./config/lib/multer')).receiptUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = receiptUploadFileFilter;

  //if (receipt) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading receipt'
        });
      } else {
        
        var filepath=config.uploads.receiptUpload.dest + req.file.filename;
        res.json(filepath);
      }
    });
  
};
