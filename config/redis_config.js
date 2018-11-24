
var redis = require('redis');
var config = require('./redis_cred');

module.exports = function(logger) {
  var host = config.host;
  var port = config.port;
  var password = {
    auth_pass: config.password
  };

var client =  redis.createClient(port, host, password)
    client.on('error', function(err) {
      logger.error('::Error on Redis initializing::');
    });
    client.on('connect', function() {
      logger.debug('::Redis connection success::');
    });
    client.select(10, function(re) {
      logger.debug('::New client switched to Redis db:::', re);
    });
  
  return client ;
}
