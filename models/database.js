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


exports.AddFood = function(userid, food, callback){
    db.collection('users').update({
        _id : ObjectID(userid)
    }, 
    {$push : {foods : food}},
    { upsert: true },
    function (err, results) {
        if (!err) {
            callback();
            console.log("okay");
        } else console.log(err)
    });
}

exports.GetFoods = function(userid, callback){
    db.collection('users').findOne({_id : ObjectID(userid)}, {"foods" : true}, function(err, result) {
        if(err) console.log(err);
        console.log(result);
        callback(result);
    });
}

exports.GetFood = function(userid, callBack){
    cursor = db.collection("users").find({
        _id: ObjectID(userid)
    });
    cursor.nextObject(function (err, doc) {
        if (err) {
            console.log(err);
            callBack(true);
        } else {
            if (doc == null) {
                callBack([]);
            }
            else{
                callBack(doc.foods);
            }
        }
    });
}

exports.GetSettings = function(userid, callback){
    db.collection('users').findOne({_id : ObjectID(userid)}, {"settings" : true}, function(err, result) {
        if(err) console.log(err);
        callback(result);
    })
}

exports.UpdateSettings = function(userid, setting, callback){
    db.collection('users').update({
        _id : ObjectID(userid)
    }, 
    {$set : {settings : setting}},
    { upsert: true },
    function (err, results) {
        if (!err) {
            callback();
        } else console.log(err)
    });
}

exports.StoreMenu = function(userid, menu, callback){
    db.collection('users').update({
        _id : ObjectID(userid)
    }, 
    {$set : {menu : menu}},
    { upsert: true },
    function (err, results) {
        if (!err) {
            callback();
        } else console.log(err)
    });
}

exports.GetMenu = function(userid, callback) {
    db.collection('users').findOne({_id : ObjectID(userid)}, {"menu" : true}, function(err, result) {
        if(err) console.log(err);

        callback(result);
    })
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
