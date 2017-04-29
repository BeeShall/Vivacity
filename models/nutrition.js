var request = require("request");
var NutritionixClient = require('nutritionix');

var nutritionix = new NutritionixClient({
    appId: '807ee049',
    appKey: '9f22ea3676ac9797aa491ef338ac0cf1'
});


exports.search = function(query, filters, callback){
    url = "https://api.edamam.com/search?q=" + query + "&app_id=d935592e&app_key=dfbf374e567d38f4076d719220f25df9&from=0&to=100";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body).hits;
            var result = [];
            console.log(filters);
            for(var i = 0; i < data.length; i++){
                var mySet = new Set();
                var terms = data[i].recipe.dietLabels.concat(data[i].recipe.healthLabels);
                for(var j = 0; j < terms.length; j++){ mySet.add(terms[j]);}
                var flag = true;

                for(var j = 0; j < filters.length; j++){ 
                    console.log(filters[j]);
                    flag = mySet.has(filters[j]);
                    if(!flag) break;
                }
                if(!flag) continue;
                console.log(mySet);
                console.log(flag);
                result.push(data[i]);
            }


            callback(result);
        }
        else {
            console.log(error);
        }
    });
}





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

