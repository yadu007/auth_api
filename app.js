var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/api_end');

var app = express();
// var redis_cli = config.redis;
// var logger = config.logger
app.set('port', process.env.PORT || 3000);
app.set('host', '0.0.0.0');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var model_sync = require('./models/sync_tables');


app.use('/api', routes);

// Handle 404
app.use(function(req, res) {
    res.send({"response":"path not found"}, 404);
 });
 
 // Handle 500
 app.use(function(error, req, res, next) {
    res.status(500).send({"response":"Internal Server Error"})
 
 });
var server = http.createServer(app)
server.listen(app.get('port'), app.get('host'), function() {
   
});

// module.exports = server;