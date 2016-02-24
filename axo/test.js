var fs = require('fs');
var request = require('./request');
var settings = require('../settings');
module.exports = (function() {
  var readline = null;

  var api = {

    route : function(opts, args) {
      readline = opts.readline;
      var cmd = args.shift();
      if(handlers[cmd]) {
        handlers[cmd].apply(this, args);
      }
    }
  };


  var handlers = {
    '/test' : function() {
      console.log(settings);
      readline.prompt();
    }
  };

  return [Object.keys(handlers), api];
})()