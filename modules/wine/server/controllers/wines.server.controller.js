'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
alasql = require('alasql'),
difference = require('array-difference'),
Wine = mongoose.model('Wine'),
Transaction = mongoose.model('Transaction'),
Position = mongoose.model('Position'),
WinePrice = mongoose.model('WinePrice'),
WineBottle = mongoose.model('WineBottle'),
HistoricPositions = mongoose.model('HistoricPositions'),
Fxrate = mongoose.model('Fxrate'),
Fxratenew = mongoose.model('Fxratenew'),
Receipt=mongoose.model('Receipt'),
Log = mongoose.model('Log'),
async = require('async'),
extend = require('extend'),
CronJob = require('cron').CronJob,
request = require('request'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray=[];
    dateArray.purchase_date = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      var curr=new Date (currentDate).toDateString();
        dateArray.purchase_date.push(curr);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function getJsonDifference(obj1, obj2) {
    var result = {};
    for(key in obj1) {
        if(obj2[key] != obj1[key]) result[key] = obj2[key];
        if(typeof obj2[key] == 'array' && typeof obj1[key] == 'array') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
        if(typeof obj2[key] == 'object' && typeof obj1[key] == 'object') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
    }
    return result;
}

function remove(delKey, o) {
        for (var key in o) {
            if (typeof o[key] === "object") {
                if (remove(delKey,o[key])) { return true; }
            } else {
                if (delKey == key) {
                    delete o[key];
                    return true;
                }
            }
        }
    }

 function numProps(obj) {
  var c = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) ++c;
  }
  return c;
}   

//Custom method to convert price from selected currency to user currency on most recent date
function Currency_convert(price, from_currency, to_currency,select_date, cbd)
{  
  var from=1,to=1;
  console.log("date selected "+select_date)

      var selectedDate=new Date(select_date);
         var date2=selectedDate.getDate();
          var month2=selectedDate.getMonth();
          var year2=selectedDate.getFullYear();
          var toDate=new Date(year2,month2,(date2+1)).toISOString();
          var fromDate=new Date(year2,month2,date2).toISOString(); 



 Fxrate.find({entry_date:{"$gte": fromDate,"$lt":toDate}},function (err, fxrateUser1) {
        
      
          if(fxrateUser1.length>0){
            console.log("value exists")

   for (var i = 0; i<fxrateUser1.length; i++) {
           if(fxrateUser1[i].code == from_currency){
            from=fxrateUser1[i].rate;
              }

           if(fxrateUser1[i].code==to_currency){
            to=fxrateUser1[i].rate;
              }
           }
            cbd(to*price/from);
           
            }
            else
            {
              console.log("else execute")
            Fxrate.find({code:to_currency}).sort('-entry_date').exec(function (err, fxrateUser1) {
             // console.log("record ftch "+fxrateUser1.length)
           for (var i = 0; i<fxrateUser1.length; i++) {           
          

           if(fxrateUser1[i].code==to_currency){
            to=fxrateUser1[i].rate;
              }
            }

            Fxrate.find({code:from_currency}).sort('-entry_date').exec(function (err, fxrateUser2) {
             // console.log("record ftch "+fxrateUser2.length)
           for (var i = 0; i<fxrateUser2.length; i++) {           
          


       if(fxrateUser2[i].code == from_currency){
            from=fxrateUser2[i].rate;
              }

               
             }
             cbd(to*price/from);
      
            });     

             
      
            });

            }

          
      
      });







//   Fxrate.findOne().sort('-entry_date').exec(function (err, fxrateUser1) {
//  if(!err)
//  {
//         for (var i = 0; i<fxrateUser1.rates.length; i++) {
//           if(fxrateUser1.rates[i].currency_code==from_currency){
//             from=fxrateUser1.rates[i].conversion_rate;
//           }

//            if(fxrateUser1.rates[i].currency_code==to_currency){
//             to=fxrateUser1.rates[i].conversion_rate;
//           }
//         }
// //console.log("All Data-->"+from+" "+to+" "+(to*price)/from); 
//         cbd(to*price/from);
//  } 
// });





}

var CronJob = require('cron').CronJob;
var job = new CronJob({
 cronTime: '00 00 00 * * 0-6',
  
  
  // cronTime: '*/5 * * * * *',
  onTick: function() {

    function get_trustyou(callback) {
      var options = {
        uri : 'https://openexchangerates.org/api/latest.json?app_id=e1e249e653e648e49dfa903665de755e',
        method : 'GET'
      }; 
      var res = '';
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res = body;
        }
        else {
          res = 'Not Found';
        }
        callback(res);
      });
    }

    get_trustyou(function(resp){

      var doc = JSON.parse(resp);

      var rates = [];

      for (var key in doc.rates) {
        if (doc.rates.hasOwnProperty(key)) {

      var fxrate = new Fxrate();
      fxrate.rate = doc.rates[key];
      fxrate.code = key;

      fxrate.save(function (err) {
        if (!err) {
          console.log('Runs every weekday at 11:30:00 AM');
        }
      });
         // rates.push({currency_code: key, conversion_rate: doc.rates[key]});
        }
      }

      // var fxrate = new Fxrate();
      // fxrate.base = doc.base;
      // fxrate.rates = rates;

      // fxrate.save(function (err) {
      //   if (!err) {
      //     console.log('Runs every weekday at 11:30:00 AM');
      //   }
      // });
    });
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

job.start();


/**
 * ////// a wine
 */
 exports.create = function (req, res) {
  var wine = new Wine(req.body);
  wine.user = req.user;

  var query = {
    producer: req.body.producer,
    wine_name: req.body.wine_name,
    vintage_year: req.body.vintage_year,
    bottle_size: req.body.bottle_size,
    country_code: req.body.country_code
  };

  // console.log(query);


  Wine.findOne(query).exec(function (err, wines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(wines){

        wines.producer = req.body.producer;
        wines.wine_name = req.body.wine_name;
        wines.vintage_year = req.body.vintage_year;
        wines.bottle_size = req.body.bottle_size;
        wines.country_code = req.body.country_code;
        wines.region = req.body.region;
        wines.sub_region = req.body.sub_region;
        wines.state = req.body.state;
        wines.classification = req.body.classification;
        wines.wine_varietal = req.body.wine_varietal;
        wines.grape_varietal = req.body.grape_varietal;
        //wines.drinking_window = req.body.drinking_window;

        wines.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('----------------------********');

            res.json({_id: wines._id, msg:'Wine update successful'});
          }
        });

      }else{
        console.log('*****************');
        wine.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json({_id: wine._id, msg:'Wine Add successful'});
          }
        });
      }
    }
  });



  
};

/*receipt save // get*/

exports.getReceiptList = function (req, res) {

 Receipt.find({created_by: req.user._id}).exec(function (err, receipt) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.json(receipt);
  }

})
};




exports.addReceipt = function (req, res) {
  var receipt = new Receipt(req.body);
  receipt.created_by = req.user;
  //console.log("receipt "+receipt.tags+" id"+req.body._id)
  var query = {
    _id:mongoose.Types.ObjectId(req.body._id) 
  };

   console.log(query);
 async.waterfall([
    function(done){

  Receipt.findOne(query).exec(function (err, receipts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(receipts){
      //  var lengthr=receipts;
       
        receipts.tags=req.body.tags;
        receipts.transaction_id=req.body.transaction_id;
        receipts.name=req.body.name;
        receipts.updated_at=req.body.updated_at;

        receipts.save(function (err,receipts) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            
             done(err, receipts);
            //res.json({_id: receipts._id, msg:'Receipt update successful'});
           
          }
        });


      }else{
        console.log('*****add******');
        receipt.save(function (err,receipts) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
           
             done(err, receipts);
          }
        });
      }
    }
  });
},
function(receipts,done){
 
var prlength=receipts.transaction_id.length;
  for(var i=0;i<prlength;i++){
 
    var queryt = {
    _id:mongoose.Types.ObjectId(receipts.transaction_id[i]) 
  };

  var path=receipts.file_path;
Transaction.findOne(queryt).exec(function (err, transaction) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {

    
   var item = {
    file_path: path    
    };

    transaction.attach_receipts.push(item);
    transaction.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
           // res.json({ msg:'Receipt Updated successful'});
          }
        });
     


  }

})
}
res.json({ msg:'Receipt Updated successful'});

}
])



  
};




exports.deleteReceipt = function (req, res) {
  var receipt = new Receipt(req.body);
 //var wine = req.wine;
  var tempReceipt=receipt;

   async.waterfall([
    function(done){
  receipt.remove(function (err,receipts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
       done(err, receipts);

    }
  });
 },
 function(receipts,done){

   var pathfile=receipts.file_path ; 
    //console.log(receipts.transaction_id +" path" +pathfile);
 for(var i=0;i<receipts.transaction_id.length;i++)
      {
      
   Transaction.update({_id:mongoose.Types.ObjectId(receipts.transaction_id[i]) },{ $pull: { attach_receipts: { file_path: pathfile} } }).exec(function (err) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    } else {
         
          }

       })

      }
       res.json({ msg:'Receipt deleted successfully'});

 }

])

  
};





/**
* Show the current wine
*/
exports.read = function (req, res) {
  res.json(req.wine);
};

/**
* Update a wine
*/
exports.update = function (req, res) {

  //57278f5dc6c7fe7410f88da6

  console.log('req id',req.body._id);

  Wine.findById(req.body.wine_id._id).exec(function (err, wine) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      console.log('wine result========>',wine);


      wine.tasting_notes = req.body.tasting_notes;     
      wine.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(wine);
        }
      });

    }
  });
};
exports.updateRatings = function (req, res) {

  //57278f5dc6c7fe7410f88da6

  console.log('req id',req.body);

  Wine.findById(req.body.wine_id._id).exec(function (err, wine) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      console.log('wine result========>',wine);

     wine.ratings=req.body.wine_id.ratings;
          
      wine.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(wine);
        }
      });

    }
  });
};

exports.updatescore = function (req, res) {

  //57278f5dc6c7fe7410f88da6

  console.log('req id',req.body._id); 
     
    

   Position.findOne({user: req.user._id, _id: req.body._id}).exec(function (err, position) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
   console.log('score ',req.body.score);
     
     var sccore=req.body.score;
     if(typeof sccore!='undefined')
        position.score=req.body.score;
   
      position.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
           
             res.json(position);
          }
        });
    }
  });
     
   
 
};
exports.fxRatesUpdate = function (req, res) {

  var fxrate = new Fxrate();
  fxrate.base = req.body.base;
  fxrate.rates = req.body.rates;
  fxrate.created_by = req.user;

  fxrate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fxrate);
    }
  });
};

exports.getFxRates = function (req, res) {
  Fxrate.findOne().sort('-entry_date').exec(function (err, fxrate) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fxrate);
    }
  });
};



// Save Transaction in transaction Collection
exports.postTransaction = function (req, res, next) {

  var avg_cost_price_first;

  var user_currency=req.body.user_currency_code;
  var details = req.body.details;
  var selected_currency=details[0].currency;
  var selected_date=req.body.purchase_date;
   console.log(req.body);
 
  //console.log('User currency-->'+user_currency);
  //alert('test'+user_currency);
  async.waterfall([
    function(done){


   console.log(req.body.purchase_date);

         var selectedDate=new Date(req.body.purchase_date);
         var date2=selectedDate.getDate();
          var month2=selectedDate.getMonth();
          var year2=selectedDate.getFullYear();
          var toDate=new Date(year2,month2,(date2+1)).toISOString();
          var fromDate=new Date(year2,month2,date2).toISOString(); 
          

    Fxrate.findOne({code:details[0].currency,entry_date:{"$gte": fromDate,"$lt":toDate}},function (err, fxratenew) {
         //console.log(" currency code new fxrate "+details[0].currency);
        
          if(fxratenew!=null){
            if(details[0].currency=="USD"){
              done(err, 1);
            }
            else{
              done(err, fxratenew.rate);
            }
            }
            else
            {
            Fxrate.findOne({code:details[0].currency}).sort('-entry_date').exec(function (err, fxratenew) {
              console.log("response "+fxratenew)
             if(fxratenew!=null){
             if(details[0].currency=="USD"){
                   done(err, 1);}
             else{
              done(err, fxratenew.rate);
                }
              }else{
                 done(err, 1);
              }
          
      
            });

            }

          
      
      });

   


      // Fxrate.findOne().sort('-entry_date').exec(function (err, fxrate) {
      //    console.log(" currency code"+details[0].currency);
        

      //   for (var i = 0; i<fxrate.rates.length; i++) {
      //     if(fxrate.rates[i].currency_code==details[0].currency){
      //       done(err, fxrate.rates[i].conversion_rate);
      //        //console.log("convertion rate"+fxrate.rates[i].conversion_rate);
      //     }
      //   }
      // });

    },




    function (fxrate, done) {
    // console.log("asdf transaction")
   //  console.log(fxrate);
     // console.log(JSON.stringify(req.body));
      var transaction = new Transaction(req.body);
      console.log(transaction);
      transaction.user = req.user;
      //transaction.supplier = 'testing';
      transaction.details[0].price_usd = transaction.details[0].price/fxrate;
      transaction.book_value_usd = transaction.details[0].price_usd*transaction.details[0].price;
     
      transaction.transaction_type = 'Cr';

      avg_cost_price_first=transaction.details[0].price;
      transaction.save(function (err) {
        if (err) {
          var log = new Log();
          log.details = err;
          log.save(function (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
        } else {
          done(err, transaction);
        }

      });
    },

    function (transaction, done) {
      Transaction.aggregate([
        {"$match": {"transaction_type": "Cr"} },
        { "$unwind": "$details" },
        { "$match": {"wine_id": req.body.wine_id, "transaction_type": "Cr" } },
        {"$group": {
         "_id": {"wine_id": "$wine_id"},
         "total_price": {"$sum": { $multiply: [ "$details.qty", "$details.price_usd" ] }},
         "total_qty": {"$sum": "$details.qty" }
       }},
       {
         "$project": { "_id": 0, "user": "$_id.user", "wine_id": "$_id.wine_id", "total_price": 1, "total_qty": 1,"purchase_date":"$_id.purchase_date"}
       }], function (err, totlaCr) {
        if (!totlaCr) {
          return res.status(400).send({
            message: 'No account with that email has been found'
          });
        } else {
          done(err, totlaCr, transaction);
        }
      })
    },

    function (totlaCr, transaction, done) { 
       console.log('-------------------------------------');
       console.log('Status-->'+req.body.delivery_status[0].status);
    
      Position.findOne({wine_id:transaction.wine_id, user: req.user._id}, function (err, position) {
      //Position.findOne({wine_id:transaction.wine_id}, function (err, position) {
        if(position){
          var avg_cost_price_exist= (totlaCr[0].total_price/totlaCr[0].total_qty);
          //calling the currency converter method to convert price
          Currency_convert(avg_cost_price_exist, selected_currency, user_currency,selected_date, function(converted_price) {
         // position.avg_cost_price= converted_price; 
         console.log("call back"+converted_price);    
         position.avg_cost_price= avg_cost_price_exist;   
          position.cellar_id = transaction.cellar_id;
          position.quantity = totlaCr[0].total_qty;
          position.bottle_properties.cork_condition = req.body.cork_condition;
          position.bottle_properties.fill_level = req.body.fill_level;
          position.bottle_properties.label_condition = req.body.level_condition;
          position.user = req.user;
          position.user_currency=req.body.user_currency_code;
          position.purchase_date = req.body.purchase_date;
          position.delivery_status = req.body.delivery_status[0].status;
          savePosition();      
    });

    }else{
      console.log("new position")
      var position = new Position();
      var price_after_convert=0;
      //calling the currency converter method to convert price
      Currency_convert(avg_cost_price_first, selected_currency, user_currency,selected_date, function(converted_price) {
      price_after_convert=converted_price ; 
      console.log("call back"+price_after_convert);  
      position.wine_id = transaction.wine_id;
      position.cellar_id = transaction.cellar_id;
      position.quantity = totlaCr[0].total_qty;
      position.bottle_properties.cork_condition = req.body.cork_condition;
      position.bottle_properties.fill_level = req.body.fill_level;
      position.bottle_properties.label_condition = req.body.level_condition;
      position.purchase_date = req.body.purchase_date;
      position.delivery_status = req.body.delivery_status[0].status;
      position.user = req.user;
      position.user_currency=req.body.user_currency_code;
      position.avg_cost_price=price_after_convert;
      savePosition();      
    });

    }
        //console.log(position);


        var savePosition = function(){
          position.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            done(err, position, totlaCr,transaction);
          }
        });
        }
      });

    },


   function (position,totlaCr,transaction,done) {

      //console.log("Total Credit"+totlaCr[0].total_price+" "+totlaCr[0].total_qty);
      var winePriceUpdated=totlaCr[0].total_price/totlaCr[0].total_qty;
      var utc = new Date().toISOString().slice(0,10);
          var todayDate2=new Date(position.purchase_date);
          var date2=todayDate2.getDate();
          var month2=todayDate2.getMonth();
          var year2=todayDate2.getFullYear();
          var nextDayDate=new Date(year2,month2,(date2+1));
          var postion_purchased_date=new Date(year2,month2,date2);  
          console.log(position.wine_id+" "+todayDate2+" "+nextDayDate);
         
      //console.log('Postion Purchase Date-->'+position.purchase_date+" "+new Date());

      //WinePrice.findOne({wine_id:position.wine_id}, function (err, winePrice) {
        WinePrice.findOne({wine_id:position.wine_id, purchase_date: { "$gte": postion_purchased_date,"$lt":nextDayDate}}, function (err, winePrice) {
        if(winePrice){    
        //console.log()    
          //var historic_data_array=winePrice.historic_price;
          //pos = historic_data_array.map(function(e) { return e.dateString; }).indexOf(utc);
          winePrice.price = winePriceUpdated;
          winePrice.price_date = new Date();
          winePrice.purchase_date =new Date(position.purchase_date);
          winePrice.user = req.user;

          /*
          if(pos!=-1)
          winePrice.historic_price[pos].avg_price=winePriceUpdated; 
          else  
          winePrice.historic_price.push({date: utc,dateString:utc,avg_price:winePriceUpdated});
        */

        }else{
          var winePrice = new WinePrice();
          winePrice.historic_price={};
          winePrice.wine_id = position.wine_id;
          winePrice.price = winePriceUpdated;
          winePrice.price_date = new Date();
          winePrice.purchase_date =new Date(position.purchase_date);
          winePrice.user = req.user;
          /*
          winePrice.historic_price[0].date=utc;
          winePrice.historic_price[0].dateString=utc;
          winePrice.historic_price[0].avg_price=totlaCr[0].total_price/totlaCr[0].total_qty;
          */
          //winePrice.positions_id=position._id;
         // winePrice.positions_id = position._id;
        }
        winePrice.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            //res.json("Transaction Add successful");
            done(err,winePrice,transaction,position);
          }
          
          //done(err);
        });

      });
    },

    function (winePrice,transaction,position,done) {

      //console.log('transaction value-->'+JSON.stringify(transaction));
      var todayDateString=new Date().toDateString();
      console.log('todayDateString'+todayDateString);
      HistoricPositions.findOne({purchase_date_string:todayDateString, user: req.user._id}, function (err, winebottle) {
      if(winebottle)
      {
      winebottle.wine_id = transaction.wine_id;
      winebottle.quantity = transaction.details[0].qty;
      winebottle.purchase_date = transaction.purchase_date;
      winebottle.purchase_date_string = transaction.purchase_date.toDateString();
      winebottle.user = req.user;
      winebottle.wines = transaction.wine_id;

      winebottle.cellar_id = position.cellar_id;
      winebottle.avg_cost_price = position.avg_cost_price;
      winebottle.delivery_status = position.delivery_status;
      winebottle.bottle_properties = position.bottle_properties;
      }
      else
      {
        var winebottle = new HistoricPositions();   
        winebottle.wine_id = transaction.wine_id;
        winebottle.quantity = transaction.details[0].qty;
        winebottle.purchase_date = transaction.purchase_date;
        winebottle.purchase_date_string = transaction.purchase_date.toDateString();
        winebottle.user = req.user;
        winebottle.wines = transaction.wine_id;

        winebottle.cellar_id = position.cellar_id;
        winebottle.avg_cost_price = position.avg_cost_price;
        winebottle.delivery_status = position.delivery_status;
        winebottle.bottle_properties = position.bottle_properties;
      }


       winebottle.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            done(err, transaction,position,winebottle);
            //res.json("Transaction Add successful");
          }
        });

    });

    
    },

    function (transaction,position,winebottle,done) {

      var todayDate=new Date();
      var range=[];

      //extractind day, month and year for today date
      var tDay=todayDate.getDate();
      var tMonth=todayDate.getMonth()+1;
      var tYear=todayDate.getFullYear();  
      var tDate=tMonth+"/"+tDay+"/"+tYear;

      var todayDateOnly=new Date(tDate);
      //console.log(todayDateOnly+" "+transaction.purchase_date);
      if(todayDateOnly>transaction.purchase_date)
      {
      range = getDates(transaction.purchase_date,todayDate);
      //var rangeString = JSON.stringify(range);
      //console.log('Date Range-->'+rangeString);
      }
      HistoricPositions.update({purchase_date:{"$lt":todayDate,"$gt":transaction.purchase_date}, wine_id:transaction.wine_id},{$inc: { quantity: transaction.details[0].qty }},{ multi: true }, function (err, numAffectedWines) {

          if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } else {
          //res.json("Transaction Add successful");
          done(err,transaction,position,range,winebottle);
        }

        });
      
    },

    function (transaction,position,range,winebottle,done) {

      var todayDate=new Date();
      HistoricPositions.find({purchase_date:{"$lt":todayDate,"$gt":transaction.purchase_date}, wine_id:transaction.wine_id},{ purchase_date_string: 1,_id:0}, function (err, purchaseDatesUpdated) {

          if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } else {
          //console.log(purchaseDatesUpdated);
          console.log(range);
          purchaseDatesUpdated.purchase_date={};
          purchaseDatesUpdated.purchase_date = purchaseDatesUpdated.map(function(obj) {
          return obj.purchase_date_string;
});

          console.log('Range Length-->'+numProps(range.purchase_date));
          if(numProps(range.purchase_date)>0)
          {
          purchaseDatesUpdated.purchase_date = purchaseDatesUpdated.purchase_date.filter(function(n){ return n != undefined });
          var datesTobeInserted=[];
          datesTobeInserted=difference(range.purchase_date, purchaseDatesUpdated.purchase_date); 
          var wineBottleHistory=[];
          console.log('All dates Inserted'+datesTobeInserted);
          //console.log('1 Date'+datesTobeInserted[0]);
          //delete winebottle._id;
          winebottle = winebottle.toObject();
          delete winebottle["_id"];
         
        
          for(var i=0;i<datesTobeInserted.length;i++)
          {
             console.log(datesTobeInserted[i]+"  "+new Date(datesTobeInserted[i]));

             var dateInserted=new Date(datesTobeInserted[i]);             
             var wineBottle1=new HistoricPositions(winebottle);
             wineBottle1.purchase_date_string= dateInserted.toDateString();
             dateInserted.setDate(dateInserted.getDate() + 1);
             wineBottle1.purchase_date= dateInserted;             
             wineBottleHistory.push(wineBottle1);
          }
         } 
        } 
          //console.log('JSON Differnce'+JSON.stringify(difference(range.purchase_date, purchaseDatesUpdated.purchase_date)));
          //console.log(getJsonDifference(purchaseDatesUpdated, range));
          //console.log(wineBottleHIstory);
          done(err,wineBottleHistory);
       

        });
      
    },

    function (wineBottleHistory) {

     console.log(wineBottleHistory);
     // res.json("Transaction Done Successfully");


     async.each(wineBottleHistory, function(windBottleDoc, callback) {
     var winebottle = new HistoricPositions(windBottleDoc);
     winebottle.save(function(err, doc) {
        callback(err);
      })
}, function(err) {
    console.log('Error'+err);
    res.json("Transaction Done Successfully");
});


     
     //Potato.collection.insert(potatoBag, onInsert);
     /*
     WineBottle.collection.insert(wineBottleHistory, function(err, docs) {
       if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } else {
          res.json("Transaction Done Successfully");
        }

     });
*/
     /*
var toInsert = [];               
          wineBottleHistory.forEach(function(wbh) {
            
            toInsert.push(wbh.toObject());
          });

          console.log('To Insert'+toInsert);
          WineBottle.collection.insert(toInsert, function(err, responsesResult) {
            if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } else {
          res.json("Transaction Done Successfully");
        }           

          });
*/

/*
var batch = WineBottle.collection.initializeUnorderedBulkOp();

wineBottleHistory.forEach(function(wbh) {
         batch.insert(wbh);
          });

batch.execute(function(err,docs){
   if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } 
        else
        {
          res.json("Transaction Done Successfully");
        }

});
/*
batch.execute(function(err, result) {
    if (err) {
          return res.status(400).send({
            message: 'No Price Updated'
          });
        } else {
          res.json("Transaction Done Successfully");
        }   
};
*/
       
      
    }

    ], function (err) {
      if (err) {
        return next(err);
      }
    });
}

// Save Transaction in transaction Collection



//New code for Post Dr Transaction

exports.postDrTransaction = function (req, res, next) {
  async.waterfall([
    function(done){
      var details = req.body.details; //this detais from client
      console.log("delete trans")
       console.log(details)

  Fxrate.findOne({code:details[0].currency}).sort('-entry_date').exec(function (err, fxratenew) {
         //console.log(" currency code new fxrate "+details[0].currency);
         //console.log(fxratenew)

          
             //console.log("convertion rate"+fxratenew.rate);
             done(err, fxratenew.rate);

          
      
      });

      // Fxrate.findOne().sort('-entry_date').exec(function (err, fxrate) {
      //   console.log(details);
      //   console.log("here");
      //   for (var i = 0; i<fxrate.rates.length; i++) {
      //     if(fxrate.rates[i].currency_code==details[0].currency){ // finding 
      //       done(err, fxrate.rates[i].conversion_rate);
      //       console.log("here");
      //       // console.log(fxrate.rates[i].conversion_rate);
      //     }
      //   }


      // });
    },
    function (fxrate, done) {
      var transaction = new Transaction(req.body);
      transaction.user = req.user;
      transaction.details[0].price_usd = transaction.details[0].price/fxrate;
      transaction.book_value_usd = transaction.details[0].price_usd*transaction.details[0].price;
      transaction.transaction_type = 'Dr';

      transaction.save(function (err) {
        if (err) {
          var log = new Log();
          log.details = err;
          log.save(function (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
        } else {
          done(err, transaction);
        }
      });
    },
    
    function (transaction, done) {

      Transaction.aggregate([
        {"$match": {"user": req.user._id, "transaction_type": "Cr"} },
        { "$unwind": "$details" },
        { "$match": { "user": req.user._id, "transaction_type": "Cr" } },
        {"$group": {
         "_id": "$user", 
         "total_price": {"$sum": { $multiply: [ "$details.qty", "$details.price_usd" ] }},
         "total_qty": {"$sum": "$details.qty" }
       }},
       {
         "$project": { "_id": 0, "user": "$_id", "total_price": 1, "total_qty": 1}
       }], function (err, totlaCr) {
        if (!totlaCr) {
          return res.status(400).send({
            message: 'No account with that email has been found'
          });
        } else {
          done(err, totlaCr, transaction);
        }
      })
    },
    
    function (totlaCr, transaction, done) {

      Transaction.aggregate([
        {"$match": {"user": req.user._id, "transaction_type": "Dr"} },
        { "$unwind": "$details" },
        { "$match": { "user": req.user._id, "transaction_type": "Dr" } },
        {"$group": {
         "_id": "$user", 
         "total_price": {"$sum": { $multiply: [ "$details.qty", "$details.price_usd" ] }},
         "total_qty": {"$sum": "$details.qty" }
       }},
       {
         "$project": { "_id": 0, "user": "$_id", "total_price": 1, "total_qty": 1}
       }], function (err, totlaDr) {
        if (!totlaCr) {
          return res.status(400).send({
            message: 'No account with that email has been found'
          });
        } else {
          done(err, totlaCr, totlaDr, transaction);
        }
      })
    },
    function (totlaCr, totlaDr, transaction, done) { 
      // console.log('-------------------------------------');
      // console.log(totlaCr);
      // console.log('-------------------------------------');
      Position.findOne({wine_id:transaction.wine_id, user: req.user._id}, function (err, position) {
        if(position){
          position.cellar_id = transaction.cellar_id;
          //position.quantity = totlaCr[0].total_qty;
          position.quantity = position.quantity - parseInt(req.body.quantity);
          //position.avg_cost_price = totlaCr[0].total_price - (totlaCr[0].total_price / ( (totlaCr[0].total_qty - totlaDr[0].total_qty) ) * totlaDr[0].total_qty );
          //position.avg_cost_price = (totlaCr[0].total_price/totlaCr[0].total_qty);
          position.bottle_properties.cork_condition = req.body.cork_condition;
          position.bottle_properties.fill_level = req.body.fill_level;
          position.bottle_properties.label_condition = req.body.level_condition;
          position.user = req.user;
          position.purchase_date = req.body.purchase_date;
          position.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            done(err, position, totlaCr, totlaDr);
          }
        });
        } else {
          var log = new Log();
            log.details = "Position not find";
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
        }
        // console.log(position);
      });

    },
    function (position, totlaCr, totlaDr, done) {
      WinePrice.findOne({wine_id:position.wine_id}, function (err, winePrice) {

        if(winePrice){
          winePrice.price = position.avg_cost_price;
          winePrice.price_date = new Date();
          winePrice.user = req.user;
        }
        winePrice.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            res.json("Transaction Add successful");
          }
          
          done(err);
        });

      });
    }
    ], function (err) {
      if (err) {
        return next(err);
      }
    });
}



exports.deleteWineTransaction = function (req, res, next) {
  var wine_id = req.body.wine_id;

  async.waterfall([    
    function (done) {
      Transaction.aggregate([
        {"$match": {"user": req.user._id, "transaction_type": "Cr"} },
        { "$unwind": "$details" },
        { "$match": { "user": req.user._id, "transaction_type": "Cr" } },
        {"$group": {
         "_id": "$user", 
         "total_price": {"$sum": { $multiply: [ "$details.qty", "$details.price_usd" ] }},
         "total_qty": {"$sum": "$details.qty" }
       }},
       {
         "$project": { "_id": 0, "user": "$_id", "total_price": 1, "total_qty": 1}
       }], function (err, totlaCr) {
        if (!totlaCr) {
          return res.status(400).send({
            message: 'No account with that email has been found'
          });
        } else {
          done(err, totlaCr);
        }
      })
    },
    function (totlaCr, done) {

      Position.findOne({wine_id:wine_id, user: req.user._id}, function (err, position) {

        var doc = {};
        doc.qty = position.quantity;
        doc.price = position.avg_cost_price;


        position.quantity = 0;
        position.avg_cost_price = 0;

        position.save(function (err) {
          if (err) {
            var log = new Log();
            log.details = err;
            log.save(function (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            done(err, position, doc);
          }
        });

      });

    },
    function (position, doc, done) {
      var transaction = new Transaction();
      transaction.user = req.user;
      transaction.wine_id = position.wine_id;
      transaction.cellar_id = position.cellar_id;
      transaction.details.push({qty: doc.qty, price:doc.price});
      transaction.transaction_type = 'Dr';

      transaction.save(function (err) {
        if (err) {
          var log = new Log();
          log.details = err;
          log.save(function (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
        } else {
          res.json("Transaction remove successful");
        }
      });
      
    }
    ], function (err) {
      if (err) {
        return next(err);
      }
    });
}

exports.delete = function (req, res) {
  var wine = req.wine;

  wine.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wine);
    }
  });
};

exports.getPositionbyId = function (req, res) {
  Position.findOne({user: req.user._id, wine_id: req.param('wineId')}).exec(function (err, position) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(position);
    }
  });
};

exports.getPositionScorebyId = function (req, res) {
 console.log("request "+req.user._id)

  // console.log("user id "+req.user._id+" wine id "+req.param('wineId'))
  Position.findOne({user: req.user._id, _id: req.body._id}).exec(function (err, position) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(position);
    }
  });
};

exports.getAvgCommunity = function (req, res) {
 //console.log("request "+req.user._id)

   //console.log("user id "+req.user._id+" wine id "+req.body.wine_id._id)
  Position.find({wine_id: req.body.wine_id._id}).exec(function (err, position) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(position);
    }
  });
};
exports.list = function (req, res, next) {

 Position.find({user: req.user._id}).populate('wine_id', '').populate('cellar_id', '').exec(function (err, position) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.json(position);
  }

})
}

exports.getTransactionList = function (req, res) {

 Transaction.find({user: req.user._id}).exec(function (err, transaction) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.json(transaction);
  }

})
};

exports.getExpenditure = function (req, res) {

  Transaction.aggregate([
  {
    "$match": {
      "user": req.user._id,
      "transaction_type": "Cr"
    }
  },
  {
   "$unwind": "$details"
 },
 {
  "$match": {
    "user": req.user._id,
    "transaction_type": "Cr"
  }
},
{
 "$group": {
   "_id": "$user", 
   "total_price": {"$sum": { $multiply: [ "$details.qty", "$details.price_usd" ] }},
   "total_qty": {"$sum": "$details.qty" }
 }
},
{
 "$project": {
  "_id": 0,
  "user": "$_id",
  "total_price": 1,
  "total_qty": 1
}
}


]).exec(function (err, transaction) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
  var price_after_convert=0;
  //console.log(transaction[0].total_price+" "+req.user);
  if(transaction.length>0){
  var currentdate=new Date();
  Currency_convert(transaction[0].total_price, 'USD', req.user.currency_code,currentdate.toISOString(), function(converted_price) {
  price_after_convert=converted_price ; 
  transaction[0].total_price=price_after_convert;
  
    });
    }
    res.json(transaction);
  }
});
};

exports.getInventoryQty = function (req, res) {
  Position.aggregate(
   [
   {
    "$match": {
      "user": req.user._id,
    }
  },
  {
   $group:
   {
     _id: "$user", 
     qty: { $sum: "$quantity" },
     count: { $sum: 1 }
   }
 }
 ]
 ).exec(function (err, wines) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.json(wines);
  }
});
};


exports.getGrapeVariety = function (req, res) {
  Wine.distinct('grape_varietal.name').exec(function (err, wines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wines);
    }
  });
};

exports.getSourceSupplier = function (req, res) {
  Wine.distinct('source_supplier').exec(function (err, wines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wines);
    }
  });
};

exports.getProducerlist = function (req, res) {
  Wine.distinct('producer').exec(function (err, producer) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(producer);
    }
  });
};



exports.getProducerLocation = function(req, res) {
  Wine.find({'producer':req.body.producer}, { country_code: 1, state: 1, region: 1, sub_region: 1}).exec(function (err, producer) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(producer);
    }
  });
};

exports.getAverageWinePriceLastSixMonthsWise = function(req, res) {
 var sixMonthsOldDate= new Date();
 sixMonthsOldDate.setMonth(sixMonthsOldDate.getMonth() - 6);
 //console.log(req.body.user_id+" "+sixMonthsOldDate);
 WinePrice.aggregate([
 { $match: { 
    purchase_date: { "$gte": sixMonthsOldDate },
    user:mongoose.Types.ObjectId(req.body.user_id)
  }},
  
    {
        "$project": {
            "Average_Price" : "$price",
            "month_year" : {  "$substr": [ "$purchase_date", 0, 7 ] }
        }
    },
    {
        "$group": {
            "_id": "$month_year",
            "Average_Price": { "$avg": "$Average_Price" }
        }
    },
    {$sort: 
    {"_id":1}
  }
], function (err, winePriceData) {
        if (!winePriceData) {
          return res.status(400).send({
            message: 'No wine price data has been found'
          });
        } else {
          //console.log('WinePriceData-->'+winePriceData);
          res.json(winePriceData);
        }
      })
    };


 exports.getAverageWineBottleLastSixMonthsWise = function(req, res) {
 var sixMonthsOldDate= new Date();
 sixMonthsOldDate.setMonth(sixMonthsOldDate.getMonth() - 6);
 //console.log(req.body.user_id+" "+sixMonthsOldDate);
 HistoricPositions.aggregate([
 { $match: { 
    purchase_date: { "$gte": sixMonthsOldDate },
    user:mongoose.Types.ObjectId(req.body.user_id)
  }},
  
    {
        "$project": {
            "Average_Quantity" : "$quantity",
            "month_year" : {  "$substr": [ "$purchase_date", 0, 7 ] }
        }
    },
    {
        "$group": {
            "_id": "$month_year",
            "Average_Quantity": { "$avg": "$Average_Quantity" }
        }
    },
    {$sort: 
    {"_id":1}
  }
], function (err, wineBottleData) {
        if (!wineBottleData) {
          return res.status(400).send({
            message: 'No wine price data has been found'
          });
        } else {
          //console.log('WineBottleData-->'+wineBottleData);
          res.json(wineBottleData);
        }
      })
    };   



    // Webservice for country graph


exports.getCountryGraphData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({ user:mongoose.Types.ObjectId(req.body.user_id) }).populate('wines','country_code').exec(function (err, userWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     done(err, userWineBottle);
     //res.json(wineBottleCountry);
    }
    });
    },

    function(userWineBottle){
     var countryAndWineQuantity= alasql('SELECT  wines->country_code as country,SUM(quantity) AS WineQuantity  FROM ? GROUP BY wines->country_code',[userWineBottle]);
      res.json(countryAndWineQuantity);
    }
    ]);

    };   

   // Webservice for Varietal graph
exports.getVarietalGraphData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({ user:mongoose.Types.ObjectId(req.body.user_id) }).populate('wines','wine_varietal').exec(function (err, userWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     done(err, userWineBottle);
     //res.json(wineBottleCountry);
    }
    });
    },

    function(userWineBottle){
     var varietalAndWineQuantity= alasql('SELECT  wines->wine_varietal as varietal,SUM(quantity) AS WineQuantity  FROM ? GROUP BY wines->wine_varietal ORDER BY WineQuantity DESC LIMIT 10',[userWineBottle]);
      res.json(varietalAndWineQuantity);
    }
    ]);

    }; 


// Webservice for Vertical graph
exports.getVerticalGraphData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({user:mongoose.Types.ObjectId(req.body.user_id),wine_id:req.body.wine_id }).populate('wines','vintage_year').exec(function (err, userWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     done(err, userWineBottle);
     //res.json(wineBottleCountry);
    }
    });
    },

    function(userWineBottle){
     var verticalAndWineQuantity= alasql('SELECT  wines->vintage_year as vintage_year,SUM(quantity) AS WineQuantity  FROM ? GROUP BY wines->vintage_year ORDER BY WineQuantity DESC LIMIT 10',[userWineBottle]);
      res.json(verticalAndWineQuantity);
    }
    ]);

    }; 

     // Webservice for Vintages graph
exports.getVintagesGraphData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({user:mongoose.Types.ObjectId(req.body.user_id)}).populate('wines','vintage_year').exec(function (err, userWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     done(err, userWineBottle);
     //res.json(wineBottleCountry);
    }
    });
    },

    function(userWineBottle){
     var vintagesAndWineQuantity= alasql('SELECT  wines->vintage_year as vintage_year,SUM(quantity) AS WineQuantity  FROM ? GROUP BY wines->vintage_year ORDER BY WineQuantity DESC LIMIT 4',[userWineBottle]);
      res.json(vintagesAndWineQuantity);
    }
    ]);

    }; 
    
    




// Webservice to get Wines by UserId
exports.getWineByUser = function (req, res) {
 Wine.find({user:mongoose.Types.ObjectId(req.body.user_id)},{_id:1,wine_name:1,producer:1}).sort({ _id: -1 }).exec(function (err, wines){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wines);
    }
  });
}; 


// Webservice for producer graph
exports.getProducersGraphData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({ user:mongoose.Types.ObjectId(req.body.user_id) }).populate('wines','producer').exec(function (err, producerWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     done(err, producerWineBottle);
    
    }
    });
    },

    function(producerWineBottle){
     var producerAndWineQuantity= alasql('SELECT  wines->producer,SUM(quantity) AS WineQuantity  FROM ? GROUP BY wines->producer ORDER BY WineQuantity DESC LIMIT 6',[producerWineBottle]);
      res.json(producerAndWineQuantity);
    }
    ]);

    };   

// Get transaction in order of purchase date

exports.getLastTransactions=function(req,res){

Transaction.find({user: req.user._id}).sort('-purchase_date').exec(function (err, transactionlist) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
   
    res.json(transactionlist)
   
    }
    });
  
};

//get Region graph data

 exports.getRegionBottleData = function(req, res) {
async.waterfall([
function(done){
HistoricPositions.find({ user:mongoose.Types.ObjectId(req.body.user_id) }).populate('wines','region').exec(function (err, regionWineBottle){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(regionWineBottle);
     done(err, regionWineBottle);
    
    }
    });
    },

    function(regionWineBottle){
     var regionAndWineQuantity= alasql('SELECT  wines->region as region,quantity AS WineQuantity  FROM ?  ORDER BY WineQuantity DESC ',[regionWineBottle]);
      res.json(regionAndWineQuantity);
    }
    ]);

    }; 

//get Top Distributors Data Graph



exports.getTopDistributors = function(req, res) {
 Transaction.aggregate([
 { $match: { 
    user:mongoose.Types.ObjectId(req.body.user_id),
    source_supplier: { $exists: true } 
  }},
  { "$unwind": "$details" },
  
    {
        "$project": {
            "price" : "$details.price",
            "supplier" : "$source_supplier"
        }
    },
    {
        "$group": {
            "_id": "$supplier",
            "Price": { "$sum": "$price" }
        }
    },
    {$sort: 
    {"Price":-1}
  },
    {$limit:4}

], function (err, topDistributors) {
        if (!topDistributors) {
          return res.status(400).send({
            message: 'No wine price data has been found'
          });
        } else {
          //console.log('WinePriceData-->'+winePriceData);
          res.json(topDistributors);
        }
      })
    };



//get Total  Distribution Data Graph

exports.getTotalDistributionPrice = function(req, res) {
 Transaction.aggregate([
 { $match: { 
    user:mongoose.Types.ObjectId(req.body.user_id),
    source_supplier: { $exists: true } 
  }},
  { "$unwind": "$details" },
  
    {
        "$group": {
           _id: null,
           "total": { "$sum": "$details.price" }
        }
    }

], function (err, topDistributors) {
        if (!topDistributors) {
          return res.status(400).send({
            message: 'No wine price data has been found'
          });
        } else {
          //console.log('WinePriceData-->'+winePriceData);
          res.json(topDistributors);
        }
      })
    };    




exports.getWinelist = function (req, res) {
  Wine.distinct('wine_name').exec(function (err, wines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wines);
    }
  });
};

exports.wineByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Wine is invalid'
    });
  }

  Wine.findById(id).populate('user', 'displayName').exec(function (err, wine) {
    if (err) {
      return next(err);
    } else if (!wine) {
      return res.status(404).send({
        message: 'No wine with that identifier has been found'
      });
    }
    req.wine = wine;
    next();
  });
};



/* service to find average price of all wines */


exports.getAverageWinePrice = function (req, res) {

  var currentDate = new Date();
  var yearAgoTime = new Date().setFullYear(currentDate.getFullYear()-1);
  var agoDate = new Date(yearAgoTime);
  var avg_market_price=0;
  var quantity1;


  async.waterfall([
    function(done){

      WinePrice.find({$and:[{ user: req.body.user_id },{"price_date": {"$gte": agoDate}}]}, { price: 1, wine_id: 1, _id: 0 }).sort({_id:-1}).limit(100).exec(function(err,WinePrices){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //getData(WinePrices);
     done(err, WinePrices);
    }
      });


    },

    function(WinePrices,done){
      //console.log(WinePrices);
      var prlength=WinePrices.length;
      var j=0;
      //res.json(WinePrices);

      var i = -1;
      var next = function(){
        i++;
        if(i<WinePrices.length) {
          var pr=WinePrices[i].price;
          Position.findOne({wine_id:WinePrices[i].wine_id},{quantity:1}).exec(function(err,WineQuantity){
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            j++;
            quantity1=WineQuantity.quantity;
           // console.log(pr+" "+quantity1);
            avg_market_price=avg_market_price+(pr*quantity1);
            //console.log("avg  "+avg_market_price);
            if(j==prlength)
            {
              var price_after_convert=0;
              var currentdate=new Date();
              //console.log("final avg return  "+avg_market_price+" "+req.body.user_currency);
              Currency_convert(avg_market_price, 'USD', req.body.user_currency,currentdate.toISOString(), function(converted_price) {
                price_after_convert=converted_price ;
                res.json({"price":price_after_convert});
                next();
              });
            } else {
              next()
            }
          });
        }
      }
      next();

      //for (var i = 0; i<WinePrices.length; i++) {
      //  var pr=WinePrices[i].price;
      //  Position.findOne({wine_id:WinePrices[i].wine_id},{quantity:1}).exec(function(err,WineQuantity){
      //    if (err) {
      //      return res.status(400).send({
      //        message: errorHandler.getErrorMessage(err)
      //      });
      //    }
      //    j++;
      //    quantity1=WineQuantity.quantity;
      //    console.log(pr+" "+quantity1);
      //    avg_market_price=avg_market_price+(pr*quantity1);
      //    console.log("avg  "+avg_market_price);
      //    if(j==prlength)
      //    {
      //      var price_after_convert=0;
      //      console.log("final avg return  "+avg_market_price+" "+req.body.user_currency);
      //      Currency_convert(avg_market_price, 'USD', req.body.user_currency, function(converted_price) {
      //        price_after_convert=converted_price ;
      //        res.json({"price":price_after_convert});
      //      });
      //    }
      //  });
      //
      //}

    }

    ]);




};





exports.searchWine = function (req, res) {  

  var searchText = req.param('q');
  var data = JSON.parse(searchText);

  var query = {};

  if(data.producer)
    extend( query, { producer : data.producer } );

  if(data.wineName)
    extend( query, { wine_name: data.wineName } );

  if(data.vintageYears)
    extend( query, { vintage_year: data.vintageYears } );

  if(data.bottleSize)
    extend( query, { bottle_size: data.bottleSize } );

  if(data.country)
    extend( query, { country_code: data.country } );

  // console.log(JSON.stringify(query)+'===================');



  Wine.findOne(query).exec(function (err, wine) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(wine);
    }
  });
};
