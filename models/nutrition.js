var request = require("request");

exports.searchNutritionItem = function(item_name, max, callback){
    var results = "Nice";
    var err;
    url = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + item_name + "&sort=n&max=" + max + "&offset=0&api_key=bac0aIidUBM8smRIhuISlT6Ke5nanPC8mon86XAo";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(err, JSON.parse(body));
        }
        else {
            console.log(error);
        }
    });
}


exports.searchByID = function(ids, callback){

    for(var i = 0; i < ids.length; i++){
        ids[i] = "ndbno=" + ids[i];
    }
    var ndbnos = ids.join("&");
    var url = "https://api.nal.usda.gov/ndb/V2/reports?" + ndbnos + "&type=f&format=json&api_key=bac0aIidUBM8smRIhuISlT6Ke5nanPC8mon86XAo";
    console.log(url);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        }
        else {
            console.log("Something went wrong");
            console.log(error);
        }
    });
}

