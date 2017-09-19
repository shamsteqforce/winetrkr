'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cellars = mongoose.model('Cellar'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a article
 */
exports.create = function (req, res) {
  var cellar = new Cellars(req.body);
  //console.log(req.user+" sfssdf "+req.body.user);

   async.waterfall([
    function(done){
    Cellars.findOne({cellar_name: req.body.cellar_name}).exec(function (err, cellars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(cellars)
        done(err, cellars);
      else
      {
        cellar.users={};
        cellar.users[0].user_id = req.user;
        cellar.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(cellar);
            }
          });
      }
    }
      });


    },

    function(cellars){
    Cellars.findOne({cellar_name: req.body.cellar_name,users: { $elemMatch: { user_id: req.user } }}).exec(function (err, cellars1) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(cellars1)
      {
        //console.log('Yes'+cellars1);
        return res.status(400).send({
        message:"Cellar Already Exist for this User"
      });
        //done(err, cellars1);
      }
      else
      {
        //console.log('No');
       cellars.users.push({user_id: req.user});
        cellars.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(cellars);
            }
          });
         
      }
    }
      });

        }

    ]);
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Cellars
 */
exports.list = function (req, res) {
  //Cellars.find({user: req.user._id}).sort('-updated_at').exec(function (err, cellers) {
  Cellars.find().sort('-updated_at').exec(function (err, cellers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cellers);
    }
  });
};

exports.getMyCellars = function (req, res) {
  //Cellars.find({user: req.user._id}).sort('-updated_at').exec(function (err, cellers) {
    console.log('User Id'+req.body.user_id);
  Cellars.find({"users.user_id":mongoose.Types.ObjectId(req.body.user_id)}).exec(function (err, cellers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cellers);
    }
  });
};


/*Cellars details by name
*/
exports.getCellarDetails = function(req, res) {
  Cellars.find({'cellar_name':req.body.cellar_name}, { country: 1, state: 1, city: 1, address_line1: 1, address_line2: 1,postcode: 1}).exec(function (err, cellers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cellers);
    }
  });
};

/**
 * Cellars middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cellers is invalid'
    });
  }

  Cellars.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
