
var request = require("request");
var FoodGroups = require('./food_groups.js')
var Nutrition = require('./nutrition.js')

var remote_server = "http://caa547b2.ngrok.io"


exports.GetTopics = function(foods, callback){
    var url = remote_server + "/topics";
    
    request.post(url, {json : {foods : foods}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            GenerateMenu(body, function(menu){
                Nutrition.searchByID(menu, function(result){
                    console.log(result.foods);
                    callback(result.foods);
                });
            });

        } else {
            console.log(error);
        }
    });
}

function GenerateMenu(topics, callback){
    var keywords = topics.topics[0].split(" ");
    var foods = [];
    var i = keywords.length;

    ConcatFoods(i, keywords, foods, function(foods){
        var menu = new Set();

        while(menu.size < 10){
            menu.add(foods[Math.floor(Math.random() * foods.length)]);
        }

        callback(Array.from(menu));
    });
}

function ConcatFoods(iter, keywords, foods, callback){
    console.log("iteration: " + iter);
    Nutrition.searchNutritionItem(keywords[iter], 1000, function(err, results){
        if(results.list){
            for(var j = 0; j < results.list.item.length; j++){
                var parts = results.list.item[j].name.split(", ");
                var ndbno = results.list.item[j].ndbno;
                parts.pop();
                var title = parts.join(" ");
                foods.push(ndbno);
            }
        }

        if(iter > 0){
            iter -= 1;
            ConcatFoods(iter, keywords, foods, callback);
        } else{
            console.log(foods);
            console.log(foods.length);
            callback(foods);
        }
    });
}

