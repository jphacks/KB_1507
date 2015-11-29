var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
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

var results = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: {
        maxAge: 300000
    }
}));

app.use(function(req, res, next){
    console.log(req.session);
    console.log(req.sessionID);
    next();
});

app.use(express.static(__dirname + '/public'));
app.post('/grade', function(req, res){
    results[req.sessionID] = {stauts: 'processing'};
    res.status(200);
    res.redirect('/result');
    res.end();
    var files = [];
    request.getAsync(req.body)
    .then(function(result){
        var body = result[1];
        files.push({
            name: 'index.html',
            body: body
        });
        return jsdom.envAsync(body);
    })
    .then(function(window){
        var static_data_list = [];
        var links = window.document.getElementsByTagName('link');
        for(var i = 0; i < links.length; i++){
            var href = links[i].getAttribute('href');
            var rel = links[i].getAttribute('rel');
            if(href && rel == 'stylesheet'){
                static_data_list.push(href);
            }
        }
        var scripts = window.document.getElementsByTagName('script');
        for(var j = 0; j < scripts.length; j++){
            var src = scripts[j].getAttribute('src');
            if(src){
                static_data_list.push(src);
            }
        }
        return Promise.resolve(static_data_list);
    })
    .then(function(list){
        console.log(list);
        return Promise.all(list.map(function(file_path){
            return getStaticData(file_path, req.body.url);
        }));
    })
    .then(function(result){
        for(var i = 0; i < result.length; i++){
            // console.log(result[i].name);
            // console.log(result[i].body);
            files.push(result[i]);
        }
        files.map(function(file){
            fs.writeFile('./staticFiles/'+ file.name, file.body);
        });
        return Promise.resolve(files);
    })
    .then(function(){
        var len = files.length;
        var points = [];
        for(var i = 0; i < len; i++){
            files[i].points = checkLegacy(files[i]);
        }
    })
    .then(function(){
        results[req.sessionID].score = 100;
        results[req.sessionID].status = 'done';
    });
});

app.post('/score', function(req, res){
    if(!results[req.sessionID]) {
        res.status(400);
        res.send('あなたからのリクエストを受けていないかタイムアウトしました');
        res.end();
    } else {
        var result = results[req.sessionID];
        var interval = setInterval(function(){
            if(result.status == 'done'){
                res.status(200);
                res.send(String(result.score));
                res.end();
                clearInterval(interval);
            } else if(result.status == 'error'){
                res.status(500);
                res.send('診断中にエラーが発生しました');
                res.end();
                clearInterval(interval);
            }
        }, 1000);
        setTimeout(function(){
            clearInterval(interval);
        }, 60000);
    }
});

app.post('/detail', function(req, res){
    if(!results[req.sessionID]) {
        res.status(400);
        res.send('あなたからのリクエストを受けていないかタイムアウトしました');
        res.end();
    } else {

    }
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
