var fs = require('fs');
var request = require('request');
var Spinner = require('cli-spinner').Spinner;
var settings = require('../settings');
module.exports = (function() {
  var access_token;
  var spinner = new Spinner('%s');
  spinner.setSpinnerString('|/-\\');

  var loadToken = function() {
    try {
      fs.readFile(settings.token_file, 'utf8', function (err, data) {
        // if (err) throw err;
        if(!err) {
          access_token = data.replace(/(\r\n|\n|\r)/gm,"");
        }
      });
    }
    catch(e) {}
  };


  function getPath(path) {
    return 'https://' + settings.account.axosoft_domain + '/api/v1/' + path;
  }
  function getParams(params) {
    var _p = [];
    if(params) {
      for(var p in params) {
        _p.push(p + '=' + params[p]);
      }
    }
    _p.push('access_token=' + access_token);
    return _p.join('&');
  }

  var api = {};

  api.get = function(path, queryParams, callback) {
    if(!access_token) {
      callback(new Error('No token'));
      console.log('No access token');
      return;
    }
    spinner.start();
    request.get(getPath(path) + '?' + getParams(queryParams), function(err, response, body) {
      spinner.stop(true);
      callback(err, JSON.parse(body));
    });
  }.bind(api);

  api.postJSON = function(path, postData, callback) {
    if(!access_token) {
      callback(new Error('No token'));
      console.log('No access token');
      return;
    }
    var obj = {
      url : getPath(path) + '?' + getParams(),
      method : 'POST',
      json : postData,
      body : postData
    }
    spinner.start();
    request(obj, function(err, response, body) {
      spinner.stop(true);
      callback(err, body);
    });
  };
  api.post = function(path, postData, callback) {
    if(!access_token) {
      callback(new Error('No token'));
      console.log('No access token');
      return;
    }
    spinner.start();
    request.post(getPath(path), postData, function(err, response, body) {
      spinner.stop(true);
      callback(err, JSON.parse(body));
    });
  }.bind(api);

  api.isLoggedIn = function() {
    return access_token ? true : false;
    //https://scrunch.axosoft.com/auth?response_type=code&client_id=3fde1215-873d-4407-a7f3-c38e50ef78c0&redirect_uri=https%3A%2F%2Fbmn.name%2Faxosoft-token&scope=read%20write&expiring=false
  }.bind(api);


  loadToken();


  // return api;
  return api;
})()