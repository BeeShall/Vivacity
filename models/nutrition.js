var request = require("request");

exports.searchNutritionItem = function(item_name, callback){
    var results = "Nice";
    var err;
    url = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + item_name + "&sort=n&max=25&offset=0&api_key=bac0aIidUBM8smRIhuISlT6Ke5nanPC8mon86XAo";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(typeof(body));
            callback(err, JSON.parse(body));
        }
    });

}


