'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		facebookId: String,
		displayName: String,
		username: String,
		email: String,
});

module.exports = mongoose.model('User', User);
