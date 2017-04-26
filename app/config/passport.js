'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		'clientID': process.env.FACEBOOK_APP_ID,
		'clientSecret': process.env.FACEBOOK_APP_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/facebook/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'facebookId': profile.facebookId }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.facebookId = profile.facebookId;
					newUser.username = profile.username;
					newUser.displayName = profile.displayName;
					newUser.email = profile.email;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
};
