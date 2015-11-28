var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(58000);
console.log('server is running at localhost:58000');
