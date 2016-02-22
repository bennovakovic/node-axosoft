var fs = require('fs');
var exec = require('child_process').exec;
var settings = require('../settings');
var me;
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

  var getAuthUrl = function(params) {
    var baseUrl = 'https://' + settings.account.axosoft_domain + '/auth';

    var _p = [];
    if(params) {
      for(var p in params) {
        _p.push(p + '=' + encodeURIComponent(params[p]));
      }
    }

    return baseUrl + '?' + _p.join('&')

  }

  var handleLogin = function() {
    var params = {
      response_type : 'code',
      client_id : settings.account.axosoft_client_id,
      // redirect_uri : 'https://bmn.name/axo/token-exchange,
      redirect_uri : 'http://127.0.0.1:11180/axo/token-exchange',
      scope : 'read write',
      expiring : false

    }
    var url = getAuthUrl(params);
    exec('open "' + url + '"');
    console.log('Opening ' + url);
    console.log('If your browser doesn\'t open, please copy-paste into your browser manually.');
    console.log('Cnce you have compete the browser steps, type /token <accessToken> to save your token.')
    readline.prompt();
  };

  var handleToken = function(token) {
    if(token) {
      writeTokenToFile(token, function(err) {
        if(!err) {
          console.log('Token saved.');
        }
        else {
          console.log('Failed to save token.');
        }
        readline.prompt();
      });
    }
    else {
      console.log('No token provided - ignoring.');
      readline.prompt();
    }
  };

  var writeTokenToFile = function(token, callback) {
    try {
      fs.mkdirSync(settings.cache_dir);
    }
    catch(e){};
    fs.writeFile(settings.token_file, token, function(err) {
        if(err) {
          console.log('Error writing token to file.', err);
          callback(err);
          return;
        }
        callback(null);
    });
  }

  var handlers = {
    '/login' : handleLogin.bind(this),
    '/token' : handleToken.bind(this),
  };

  return [Object.keys(handlers), api];
})()