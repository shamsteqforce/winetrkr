var express = require("express"); // web development framework
var bodyParser = require('body-parser');
//var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');





// express ===============================================================

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection ===============================================================
mongoose.connect(config.database, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});

var UserApi = require('./controllers/UserController.js')(app, express);
app.use('/api', UserApi);


app.listen(config.port, function (err) {
	if (err)
		console.log(err);
	else
	    console.log("Listening at port 3000");
	//console.log("hi" + __dirname);

});