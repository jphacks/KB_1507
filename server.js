var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.post('/grade', function(req, res){
    console.log(req.body);
    res.status(200);
    res.end();
});

app.listen(58000);
console.log('server is running at localhost:58000');
