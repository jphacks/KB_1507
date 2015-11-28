var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.post('/grade', function(req, res){
    console.log(req.body);
    res.status(200);
    request.get(req.body, function(err, res, body){
        console.log(body);
        fs.writeFile('./getData.html', body, function(err){
            if(err){
                console.error(err);
            }
        });
    });
    res.send(req.body.url);
    res.end();
});

app.listen(58000);
console.log('server is running at localhost:58000');
