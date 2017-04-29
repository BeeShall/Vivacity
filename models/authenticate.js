
var bcrypt = require("bcryptjs");
var LocalStrategy = require('passport-local').Strategy;

exports.generateUser = function (db, user, pass, email,callBack) {
    console.log(user)
    console.log(pass)
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(pass, salt, function (err, hash) {
            db.createUser(user, hash, email, callBack);
        });
    });
}

exports.setAuthentication = function (passport, db) {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (user, pswd, done) {
            db.getUser(user, function (error, data) {
                if (error) {
                    console.log("Invalid username.");
                    return done(null, false);
                }
                bcrypt.compare(pswd, data.password, function (err, isMatch) {
                    if (err) return done(err);
                    if (!isMatch) {
                        console.log("Invalid password");
                    } else {
                        console.log("Valid credentials");
                    }
                    
                    done(null, (isMatch ? data.id : false));
                })

            });
        }))

    passport.serializeUser(function (username, done) {
        done(null, username);
    });
    passport.deserializeUser(function (username, done) {
        done(null, username);
    });
}