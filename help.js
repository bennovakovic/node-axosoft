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
    console.log('---------------------------');
    console.log('');
    console.log('/f to start working on a feature ticket');
    console.log('/b to start working on a bug ticket');
    console.log('/finish to stop work on a bug/ticket');
    console.log('/log to send the current time with a worklog');
    console.log('/timer to see how long you have spent on the current ticket (unlogged)');
    readline.prompt();
  };

  var handlers = {
    '/help' : handleHelp.bind(this)
  };

  return [Object.keys(handlers), api];
})()