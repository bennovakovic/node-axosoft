var fs = require('fs');
var request = require('./request');
var settings = require('../settings');
module.exports = (function() {
  var readline = null;
  var me = null;

  var getMe = function(callback) {
    if(!me) {
      request.get('/me', {}, function(err, data) {
        if(!err) {
          me = data.data;
          callback(null, me);
        }
      })
    }
    else {
      callback(null, me);
    }
  }

  var api = {

    route : function(opts, args) {
      readline = opts.readline;
      var cmd = args.shift();
      if(handlers[cmd]) {
        handlers[cmd].apply(this, args);
      }
    },
    getMe : function(callback) {
      getMe(callback);
    }
  };


  var handlers = {
    '/me' : getMe.bind(this)
  };

  return [Object.keys(handlers), api];
})()