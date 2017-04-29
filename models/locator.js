var request = require("request");
var parseString = require('xml2js').parseString;

exports.getLocations = function(brand, item, callback){
    brand = brand.replace(" ", "+");
    item = item.replace(" ", "+");
    var url = "http://www.supermarketapi.com/api.asmx/SearchByProductName?APIKEY=554b487bd6&ItemName=" + "apple";
    console.log(url);
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(body);
            parseString(body, function(err, result){
                if(err) console.log(err);
                console.log(result);
                callback(result);
            })
            
        }
        else {
            console.log("Something went wrong")
            console.log(error);
        }
    });
}

