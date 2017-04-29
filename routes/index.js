var express = require('express');
var router = express.Router();
var auth = require('../models/authenticate.js')
var db = require('../models/database.js')
var ObjectID = require('mongodb').ObjectID;
var search = require('../models/search.js')
var NodeGeocoder = require('node-geocoder');
var Nutrition = require('../models/nutrition.js')
var Core = require("../models/core.js");
var Locator = require("../models/locator.js");

var geooptions = {
  provider: 'google',
  httpAdapter: 'https',
  formatter: null         
};
var geocoder = NodeGeocoder(geooptions);


var ensureLoggedIn = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// WEB ROUTES
router.get('/', ensureLoggedIn, function (req, res, next) {
	db.GetMenu(req.user, function(result){
		res.render("index", {menu: result});
	});
});

router.get('/gettopics', ensureLoggedIn, function (req, res, next) {
	db.GetFood(req.user, function(foods){

		var parsed = [];
		for(var i = 0; i < foods.length; i++){
			parsed.push(foods[i].name);
		}

		Core.GetTopics(parsed, function(result){

			db.StoreMenu(req.user, result, function(){
				res.setHeader('Content-Type', 'application/json');
				res.send("Nice");
			});

		});
	});
});


function GetNearby(coords, callback){
	callback(coords);
}


router.get('/getmenu', ensureLoggedIn, function (req, res, next) {
	db.GetMenu(req.user, function(result){
		res.setHeader('Content-Type', 'application/json');
		res.send({success:true, menu:result});
	});
});



router.post('/addfood', function(req, res, next){

	console.log(req.body.name);
	console.log(req.body.ndbno);

	db.AddFood(req.user, req.body.name, req.body.ndbno, function(){
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: true});	
		});
});


function TrimSearch(results, callback){
			// Trim the results
			var model = {items : []};
			for(var i = 0; i < results.list.item.length; i++){
				var parts = results.list.item[i].name.split(", ");
				parts.pop();
				var title = parts.join(" ");
				console.log(title);
				model.items.push({ name : title, ndbno : results.list.item[i].ndbno} );
			}

			callback(model);
}

router.post('/search', function(req, res, next){
	res.setHeader('Content-Type', 'application/json');
	if(req.body.keywords && req.body.keywords.trim() != ""){
		Nutrition.search(req.body.keywords, function(results){
				var model = {
					success : true,
					results : results
				}
				res.send(model);
		});
	} else{
		res.send({success:false});
	}
});

router.post('/findfood', function(req, res, next){
	console.log(req.body.item);
	console.log(req.body.brand);
	res.setHeader('Content-Type', 'application/json');
	Locator.getLocations(req.body.brand, req.body.item, function(result){
			res.send({success:true, result:result});
	});

});

// REFACTORED BEHAVIOR
function GetCoordinates(addr, callback){
	geocoder.geocode(addr, callback);
}

// AUTHENTICATION
router.post('/login', function (req, res, next) {
  var passport = req.app.locals.passport;
  var auth = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login_fail',
  });
  auth(req, res);

});


router.get('/login', function (req, res, next) {
  res.render('login', {});
});

router.get('/login_fail', function (req, res, next) {
  res.render('login_fail');
});

router.get('/index', ensureLoggedIn, function (req, res, next) {
  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  res.render('sign_up');
});

router.get('/logout', function (req, res, next) {
  delete req.user;
  res.redirect('/login');
})



router.post('/signup', function (req, res, next) {
  var mongo = req.app.locals.db;
  auth.generateUser(mongo, req.body.username, req.body.password, req.body.email, function (done) {    
    var passport = req.app.locals.passport;
    var auth = passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login_fail',
    });
    auth(req, res);

  })
});

router.post('/login_mobile', function (req, res, next) {
  var passport = req.app.locals.passport;
  var auth = passport.authenticate('local', function(err, user, info){
  	if(err){
  		console.log(err);
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: false});
  	}
  	else if(!user) {
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: false});
  	}
  	else {
  		console.log(user);
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: true, user:user});
  	}
  });
  auth(req, res);

});

router.post('/signup_mobile', function (req, res, next) {
  var mongo = req.app.locals.db;
  auth.generateUser(mongo, req.body.username, req.body.password, req.body.email, function (done) {
    
    var passport = req.app.locals.passport;
    var auth = passport.authenticate('local', function(err, user, info){
	  	if(err){
	  		console.log(err);
	  		res.setHeader('Content-Type', 'application/json');
		    res.send({success: false});
	  	}
	  	else if(!user) {
	  		console.log(info);
	  		res.setHeader('Content-Type', 'application/json');
		    res.send({success: false});
	  	}
	  	else {
	  		console.log(user);
	  		res.setHeader('Content-Type', 'application/json');
		    res.send({success: true, user:user});
	  	}
  });
    auth(req, res);

  })
});




module.exports = router;
