/**
 * User model
 */

module.exports = function(options) {
  options = options || {};
  var crypto = require('crypto')
  , mongoose = options.mongoose || require('mongoose')
  , Schema = mongoose.Schema;

  var UserSchema = new Schema({
    username : {
      type : String,
      required : true,
      unique : true,
      index : true,
      display : {
        help : 'This must be a unique name'
      }
    },
    first_name : {
      type : String
    },
    last_name : {
      type : String
    },
    email : {
      type : String
    },
    password : {
      type : String
    },
    created_at : {
      type : Date
    },
    modified_at : {
      type : Date
    }
  });

  function sha1b64(password) {
    return crypto.createHash('sha1').update(password).digest('base64');
  }

  UserSchema.pre('save', function(next) {

    var _this = this;
    if (this._doc.password && this._doc.password != '_default_') {
      this.password = sha1b64(_this._doc.password)
    }
    if (this.isNew)
      this.created_at = Date.now();
    else
      this.modfied_at = Date.now();
    next();
  });

  UserSchema.statics.findByUsernamePassword = function(username, password, callback) {
    return this.findOne({
      username : username,
      password : sha1b64(password)
    }, callback);
  }

  var User = mongoose.model("users", UserSchema);

  module.exports.createUser = function(username, password) {
    User.create({
      username : username,
      password : password
    }, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
  }
}
