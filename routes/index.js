var express = require('express');
var router = express.Router();
var auth = require('../models/authenticate.js')
var db = require('../models/database.js')
var ObjectID = require('mongodb').ObjectID;
var search = require('../models/search.js')
var NodeGeocoder = require('node-geocoder');

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

router.post('/search', function(req, res, next){
	if(req.body.keywords && req.body.keywords != ""){
		search.search(req, db, function(results){
	  		res.setHeader('Content-Type', 'application/json');
			res.send({items : results});		
		});	
	} else{
		GetNearby({}, function(coords){
			var results = coords["nearbyevents"].concat(coords["nearbyprojects"]);
	  		res.setHeader('Content-Type', 'application/json');
			res.send({items : results});
		});
	}
});




router.post('/search_browser', ensureLoggedIn, function(req, res, next){
	if(req.body.keywords && req.body.keywords != ""){
		search.search(req, db, function(results){
			res.render("discover", {items : results});
		});	
	} else{
		GetNearby({}, function(coords){
			var results = coords["nearbyevents"].concat(coords["nearbyprojects"]);
			res.render("discover", {items : results});
		});
	}

});


router.post('/joinproject', ensureLoggedIn, function(req, res, next){
	console.log(req.body.itemid);
	db.JoinProject(req.body.itemid, req.user, function(){
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: true});
	});
});


router.post('/joinevent', ensureLoggedIn, function(req, res, next){
	db.JoinEvent(req.body.itemid, req.user, function(){
  		res.setHeader('Content-Type', 'application/json');
	    res.send({success: true});
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
  auth.generateUser(mongo, req.body.username, req.body.password, req.body.email, req.body.zip, function (done) {
    
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
