var fs = require('fs');
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

  var handleHelp = function() {
    console.log('Press <tab> to see options.');
    readline.prompt();
  };

  var handlers = {
    '/help' : handleHelp.bind(this)
  };

  return [Object.keys(handlers), api];
})()