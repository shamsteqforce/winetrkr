var User = require('../models/User');
module.exports = function (app, express) {
    var api = express.Router();
    api.post('/User', function (req, res) {
    var json={}
    //console.log(JSON.stringify(req.body));
    console.log(req.body);
    var user = new User(req.body); 
    user.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('----------------------********');
            res.json({msg:'User successful'});
          }
        }); 
    });

    return api
}