var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxlength: 100},
  }
);

// Export model
module.exports = mongoose.model('User', UserSchema);

