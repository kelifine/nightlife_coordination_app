'use strict';
var pug = require('pug');
var path = require('path');
var yelp = require('yelp-fusion');
var bodyParser = require('body-parser');
var Bar = require('./models/bars');



module.exports = function (app, passport) {

app.use(bodyParser.urlencoded({ extended: true }));

var client, signin, searchId, where, results, button;
var bars = [];

yelp.accessToken(process.env.YELP_APP_ID, process.env.YELP_APP_SECRET).then(response => {
  client = yelp.client(response.jsonBody.access_token);
}).catch(e => {
  console.log(e);
});

function barList (where, callback) {
	client.search({
			location: where,
			categories: 'bars',
		}).then(response => {
		for (var i =0; i<20; i++) {
		var newBar = new Bar();
		newBar.search = where;
		newBar.name = response.jsonBody.businesses[i].name;
		newBar.url = response.jsonBody.businesses[i].url;
		newBar.image_url = response.jsonBody.businesses[i].image_url;
		newBar.rating = response.jsonBody.businesses[i].rating;
		newBar.price = response.jsonBody.businesses[i].price;
		newBar.address = response.jsonBody.businesses[i].location.display_address;
		newBar.save();
		bars.push(newBar);	
		}
		callback();
		}).catch(e => {
		console.log(e);
		});
}

function isLoggedIn (req) {
		if (req.isAuthenticated()) {
			signin='Welcome '+req.user.toObject().displayName;
			button = 'display:inline'; 
		} else {
			signin='Log in with Facebook';
			button='display:none';
		}
	}

function findBars (zip, callback) {
	Bar.find({search: zip}, function(err, list){
			if (err) return console.log(err);
			bars = list;
			callback();
		});
}


app.route('/')
	.get(function (req, res) {
		bars = [];
		var page = pug.renderFile(path.join(__dirname, '../pug/landing.pug'));
		res.send(page);
	});


app.route('/findbars')
	.post(function(req, res) {
		isLoggedIn(req);
		where = req.body.location;
		findBars(where, function() {
			if (bars.length===0) {
			barList(where, function() {
			results = pug.renderFile(path.join(__dirname, '../pug/uaresults.pug'), {places: bars, login: signin, button: button});
			res.send(results);	
			});
			}
			else {
			results = pug.renderFile(path.join(__dirname, '../pug/uaresults.pug'), {places: bars, login: signin, button: button});
			res.send(results);	
			}
		});
		
	});
	
app.route('/auth/facebook')
	.get(passport.authenticate('facebook', {session: false}));

app.route('/auth/facebook/callback') 
 	.get(passport.authenticate('facebook', {
		successRedirect: '/findbars/'+where,
		failureRedirect: '/auth/facebook'
		}));
		
app.route('/findbars/:where')		
	.get(function(req, res) {
		isLoggedIn(req);
		findBars(where, function() {
			results = pug.renderFile(path.join(__dirname, '../pug/uaresults.pug'), {places: bars, login: signin, button: button});
			res.send(results);		
		});
	});
	
	
	
	
};


