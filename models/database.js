var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/vivacity';
var db;

MongoClient.connect(url, function (err, database) {
    if (!err) {
        console.log("Connected correctly to server.");
        db = database;
    } else {
        console.log("Cannot connect to db");
    }
});


exports.AddFood = function(userid, foodname, foodid, callback){
    db.collection('users').update({
        _id : ObjectID(userid)
    }, 
    {$push : {foods : {name: foodname, ndbno : foodid}}},
    { upsert: true },
    function (err, results) {
        if (!err) {
            callback();
        } else console.log(err)
    });   
}

exports.createUser = function (userName, password, email, callBack) {
    db.collection('users').insertOne({
        username: userName,
        password: password,
        email: email,
        foods: []
    }, function (err, results) {
        if (!err) {
            console.log("User created")
            callBack(true);
        } else console.log(err)
    });
}

exports.getUser = function (username, callBack) {
    cursor = db.collection("users").find({
        "username": username
    });
    cursor.nextObject(function (err, doc) {
        if (err) {
            console.log(err);
            callBack(true);
        } else {
            if (doc == null) {
                callBack(true);
            }
            else{
                callBack(false, {password: doc["password"] ,id: doc["_id"] });
            }
        }
    });
}
