var pattern = require('hyphenation.en-us'); 
var stripper = require('words-and-hyphens')(pattern);
var sw = require('stopword')

exports.search = function(req, db, callBack){
    console.log(req.body)
        db.GetAllEvents(null, function(docs){
            db.GetAllProjects(null, function(docs2){
                doca = docs.concat(docs2);
                callBack(searchStuff(req.body.keywords,docs));

            });
        });

            
}

function searchStuff(keywords, docs){
    var results = [];
    for(var i in docs){
        if(keywords.toLowerCase() == docs[i].title.toLowerCase()) results.push({doc:docs[i]});
    }

    if(results.length != 0 ) return results;

    var tokens = getTokens(keywords);



    for (var i in docs){
        var tags = docs[i].tags.concat(getTokens(docs[i].description));
        var matchCount = 0;
        for(j in tags){
            for(k in tokens){
                if(tags[j].toLowerCase() == tokens[k].toLowerCase()) matchCount++;
            }
        }
        if(matchCount>0) {
            docs[i]["match"] = matchCount;
            results.push(docs[i]);
        }
    }

    results.sort(function(x,y){
        return x.matchCount-y.matchCount;
    })

console.log(results);
    return results;


}

function getTokens(keywords){
    var tokens = stripper.uniqueWords(keywords);
    tokens = sw.removeStopwords(tokens);
    return tokens;

}