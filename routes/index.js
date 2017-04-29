var express = require('express');
var router = express.Router();
var auth = require('../models/authenticate.js')
var db = require('../models/database.js')
var ObjectID = require('mongodb').ObjectID;
var search = require('../models/search.js')
var NodeGeocoder = require('node-geocoder');
var Nutrition = require('../models/nutrition.js')

var geooptions = {
  provider: 'google',
  httpAdapter: 'https',
  formatter: null         
};
var geocoder = NodeGeocoder(geooptions);


var ensureLoggedIn = function (req, res, next) {
	next();
	return;
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// WEB ROUTES
router.get('/', ensureLoggedIn, function (req, res, next) {
		GetCoordinates("07430", function(err, result){
			if(!err){
				GetNearby({coords:{lat:result[0].latitude, lng:result[0].longitude}}, function(coords){
					res.render("index", coords);
				});
			}else{
				console.log(err);
				res.render("index");
			}
		});
});



function GetNearby(coords, callback){
	callback(coords);
}


router.post('/addfood', function(req, res, next){

	console.log("nice");
	res.send("success");

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
		Nutrition.searchNutritionItem(req.body.keywords, function(err, results){
			// Trim the results
			TrimSearch(results, function(model){
				res.send(model);
			});
		});
	} else{
		res.send({});
	}
});

router.post('/search_browser', ensureLoggedIn, function(req, res, next){
	if(req.body.keywords && req.body.keywords.trim() != ""){
		Nutrition.searchNutritionItem(req.body.keywords, function(err, results){
			// Trim the results
			TrimSearch(results, function(model){
				res.render("food_items", model);
			});
		});
	} else{
		res.redirect('/');
	}

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
