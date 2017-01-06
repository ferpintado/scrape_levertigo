var fs = require('fs');
var express = require('express');
var _ = require("lodash");
var request = require('request');
var Promise = require("node-promise").Promise;
var Q = require("q");

var app = express();
var output = [];


var output = [];
// var url = getItunesUrl("260190086");
var self = this;
var promise;

var fileName = "bulks/bulk_0.json";
var outputFileName = "final/rss_0.json" ;

// fs.readFile(fileName, 'utf8', function (err, data) {

// 	if (err) throw err;

// 	obj = JSON.parse(data);
// 	promise = getRss(obj);


// 	promise.then(function(result){
// 		// console.log('result', result);
// 		writeRssJson(result, outputFileName);
// 	});
// });

app.get('/rss', function(req, res){
	var output = [];
	// var url = getItunesUrl("260190086");
	var self = this;
	var promise;

	fs.readFile(fileName, 'utf8', function (err, data) {

		if (err) throw err;

		obj = JSON.parse(data);
		promise = getRss(obj);


		promise.then(function(result){
			// console.log('result', result);
			writeRssJson(result, outputFileName);
		});
	});
	res.send('Check your console!');
});

function getItunesUrl(id){
	return "https://itunes.apple.com/lookup?id="+ id +"&entity=podcast";
};

function getRss(obj){
	var count = 0;
	var countPrint = 0;
	// console.log(obj)
	 var done = Q.defer();
	 var total = obj.length;
	_.each(obj, function( item ){
		var url = getItunesUrl(item.id);
		// console.log(url);
		// console.log(output);
		request({
		    url : url,
		    rejectUnauthorized : false,
		    headers : {
		        'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
		    }
		}, function(error, response, body){
			  if (!error && response.statusCode == 200) {
			  	var obj = JSON.parse(body);
			  	if(_.isObject(obj) && _.isObject(obj.results) && _.isObject(obj.results[0]) && !_.isEmpty(obj.results[0].feedUrl) && _.isString(obj.results[0].feedUrl)){
				  	var json = { 
				  		title: item.title,
				  		rssUrl: obj.results[0].feedUrl
				  	}

				    output.push(json);
				    count++;			
				    countPrint++;	    
				    console.log(count + " of " + total);

				    if(countPrint == 1000) {
				    	console.log(count + " of " + total);
				    	writeRssJson(output, outputFileName);
				    	countPrint = 0;
				    }
				    if(count == total){
				    	done.resolve(output);
				    }

				}
			  }

		});
	});
	return done.promise;	
}

function writeRssJson(output, filename){

		fs.writeFile(filename, JSON.stringify(output, null, 4), function(err){
			console.log('File successfully written! - Check your project directory for the ' + filename + ' file');
		});		
}

app.listen("8081");
console.log('Magic happens on port 8081');
exports = module.exports = app;