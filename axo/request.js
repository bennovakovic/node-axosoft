var fs = require('fs');
var request = require('request');
var Spinner = require('cli-spinner').Spinner;
module.exports = (function() {

  var spinner = new Spinner('%s');
  spinner.setSpinnerString('|/-\\');

  var obj;
  fs.readFile('./.axotoken', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
  });


  function getPath(path) {
    return 'https://' + obj.axosoft_domain + '/api/v1/' + path;
  }
  function getParams(params) {
    var _p = [];
    if(params) {
      for(var p in params) {
        _p.push(p + '=' + params[p]);
      }
    }
    _p.push('access_token=' + obj.accessToken);
    return _p.join('&');
  }

  var api = {};

  api.get = function(path, queryParams, callback) {
    spinner.start();
    request.get(getPath(path) + '?' + getParams(queryParams), function(err, response, body) {
      spinner.stop(true);
      callback(JSON.parse(body));
    });
  }.bind(api);

  api.postJSON = function(path, postData, callback) {
    var obj = {
      url : getPath(path) + '?' + getParams(),
      method : 'POST',
      json : postData,
      body : postData
    }
    spinner.start();
    request(obj, function(err, response, body) {
      spinner.stop(true);
      callback(body);
    });
  };
  api.post = function(path, postData, callback) {
    spinner.start();
    request.post(getPath(path), postData, function(err, response, body) {
      spinner.stop(true);
      callback(JSON.parse(body));
    });
  }.bind(api);

  return api;
})()