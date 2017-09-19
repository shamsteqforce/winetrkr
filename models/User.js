/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/**
* Users Schema
*/

var UserSchema = new Schema({
    user: String,
    password: String,
    type: String
},
{
    collection: 'Users'
});

/**
 * Create instance method for hashing a password
 */

UserSchema.methods.hashPassword = function (password) {
   
  // console.log('Password Salt->'+this.passwordSalt); 
  var bytes = new Buffer(password || '', 'ucs2');
  var src = new Buffer(this.passwordSalt || '', 'base64');
  var dst = new Buffer(src.length + bytes.length);
  src.copy(dst, 0, 0, src.length);
  bytes.copy(dst, src.length, 0, bytes.length);  
  return crypto.createHash('sha1').update(dst).digest('base64');
};


/**
 * Create instance method for authenticating user
 */
 UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};



//mongoose.model('Users', UserSchema);
module.exports = mongoose.model('Users', UserSchema);