var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var jsdom = require("jsdom");
var Promise = require('bluebird');
var path = require('path');
var url = require('url');

Promise.promisifyAll(request);
Promise.promisifyAll(fs);
Promise.promisifyAll(jsdom);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.post('/grade', function(req, res){
    // console.log(req.body);
    res.status(200);
    var files = [];
    request.getAsync(req.body)
    .then(function(result){
        var body = result[1];
        // console.log(body);
        // fs.writeFile('./getData.html', body);
        files.push({
            name: 'index.html',
            body: body
        });
        return jsdom.envAsync(body);
    }).then(function(window){
        var static_data_list = [];
        var links = window.document.getElementsByTagName('link');
        for(var i = 0; i < links.length; i++){
            var href = links[i].getAttribute('href');
            var rel = links[i].getAttribute('rel');
            if(href && rel == 'stylesheet'){
                // console.log(href);
                static_data_list.push(href);
            }
        }
        var scripts = window.document.getElementsByTagName('script');
        for(var j = 0; j < scripts.length; j++){
            var src = scripts[j].getAttribute('src');
            if(src){
                // console.log(src);
                static_data_list.push(src);
            }
        }
        return Promise.resolve(static_data_list);
    }).then(function(list){
        console.log(list);
        return Promise.all(list.map(function(file_path){
            return getStaticData(file_path, req.body.url);
        }));
    }).then(function(result){
        for(var i = 0; i < result.length; i++){
            // console.log(result[i].name);
            // console.log(result[i].body);
            files.push(result[i]);
        }
        files.map(function(file){
            fs.writeFile('./staticFiles/'+ file.name, file.body);
        });
    });
    res.send(req.body.url);
    res.end();
});

app.listen(58000);
console.log('server is running at localhost:58000');

function getStaticData(file_path, page_url){
    var file = {};
    file.name = path.basename(file_path);
    var file_url = url.resolve(page_url, file_path);
    console.log(file_url);
    return request.getAsync(file_url)
    .then(function(result){
        file.body = result[1];
        return Promise.resolve(file);
    });
}
