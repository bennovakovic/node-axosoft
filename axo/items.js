var fs = require('fs');
var request = require('./request');
var notifier = require('node-notifier');
module.exports = (function() {

  var resourceBase = '/items';
  var readline = null;
  var me = null;
  var currentTicket = null;
  var startTime;

  var timerTicker = -1;

  var api = {

    route : function(opts, args) {
      readline = opts.readline;
      var cmd = args.shift();
      if(handlers[cmd]) {
        handlers[cmd].apply(this, args);
      }
      // if(action === 'find') {
      //   request.get(resourceBase, {
      //     search_string : query
      //   }, function(data) {
      //     console.log('yo.')
      //   })
      // }
      // console.log('>>>', str, again);
      // console.log(arguments);
    }
  };

  var displayNotification = function(title, message) {
    var nc = new notifier.NotificationCenter();

    nc.notify({
      'title': title,
      'message': message,
      'sound': 'Glass', // case sensitive
      'appIcon': __dirname + '/coulson.jpg',
      'contentImage': __dirname + '/coulson.jpg',
      'open': 'file://' + __dirname + '/coulson.jpg',
      'wait' : true
    });
  };

  var getMe = function(callback) {
    if(!me) {
      request.get('/me', {}, function(data) {
        me = data.data;
        callback(null, me);
      })
    }
    else {
      callback(null, me);
    }
  }

  var getFeature = function(id, callback) {
    request.get('/features/' + id, {}, function(data) {
      callback(data.data);
    })
  };

  var getDateInFormat = function(d) {
    if (!d) {
      d = new Date();
    }
    //yyyy-MM-dd'T'HH:mm'Z'
    var date_strs = [];
    var time_strs = [];
    date_strs.push(d.getFullYear());
    var m = d.getMonth() + 1;
    if(m < 10) {
      m = '0' + m;
    }
    date_strs.push(m);
    var _d = d.getDate();
    if(_d < 10) {
      _d = '0' + _d;
    }
    date_strs.push(_d);

    var h = d.getHours();
    if(h < 10) {
      h = '0' + h;
    }
    time_strs.push(h);

    m = d.getMinutes();
    if(m < 10) {
      m = '0' + m;
    }
    time_strs.push(m);
    return date_strs.join('-') + 'T' + time_strs.join(':') + 'Z';
  }

  var logWork = function(timeWorked, message, callback) {
    var timeWorked;
    var remaining = currentTicket.remaining_duration.duration;
    if(currentTicket.remaining_duration.time_unit.id === 2) {
      // hrs
      timeWorked = Math.round(((timeWorked / 60 / 60) * 100000)) / 100000;
    }
    else if (currentTicket.remaining_duration.time_unit.id === 1) {
      //mins
      timeWorked = Math.round(((timeWorked / 60) * 100)) / 100;
    }

    var logObj = {
      user : {
        id : me.id
      },
      work_done : {
        duration : timeWorked,
        time_unit : {
          id : currentTicket.remaining_duration.time_unit.id
        },
      },
      item : {
        id : currentTicket.id,
        item_type : currentTicket.item_type
      },
      description : message,
      date_time : getDateInFormat(),
      remaining_time : {
        duration : remaining - timeWorked,
        time_unit : {
          id : currentTicket.remaining_duration.time_unit.id
        }
      }

    };
    request.postJSON('/work_logs', logObj, function(data) {
      callback(data);
    })
  };



  var handleWorkOnFeature = function(id) {
    getMe(function(err, data) {
      getFeature(id, function(data) {
        currentTicket = data;
        startTime = Math.round((new Date()).getTime() / 1000);
        console.log('#################');
        console.log('Requested Ticket:');
        console.log('#' + currentTicket.id + ' ' + currentTicket.name);
        console.log('#################');
        console.log('Now logging time...');
        displayNotification('Working on #' + currentTicket.id, currentTicket.name);
        readline.setPrompt('#' + currentTicket.id + ' > ');
        readline.prompt();
      })
    })
  };
  var handleLog = function(description, callback) {

    var description = Array.prototype.slice.call(arguments);
    var callback;
    if(typeof description[description.length-1] === 'function') {
      callback = description.pop();
    }

    description = description.join(' ');

    if(!currentTicket) {
      console.log('No ticket active, please workon something.');
      readline.prompt();
      return;
    }
    var endTime = Math.round((new Date()).getTime() / 1000);
    var secondsWorked = endTime - startTime;
    console.log('Log: ', (secondsWorked / 60) + ' mins');
    logWork(secondsWorked, description, function() {
      console.log('Time logged...');
      startTime = endTime;

      if(typeof callback === 'function') {
        callback();
      }
      else {
        readline.prompt();
      }
    })
  };
  var handleFinish = function() {
    if(!currentTicket) {
      console.log('No ticket active, please work on something.');
      readline.prompt();
      return;
    }
    handleLog('Finished #' + currentTicket.id, function() {
      console.log('#################');
      console.log('Finished working on #' + currentTicket.id);
      console.log('#################');
      displayNotification('Finished work on #' + currentTicket.id, currentTicket.name);
      startTime = undefined;
      currentTicket = null;
      readline.setPrompt('> ');
      readline.prompt();
    });
  };

  var handleTimerRequest = function() {
    if(!currentTicket) {
      console.log('No ticket active, please work on something.');
      readline.prompt();
      return;
    }
    var endTime = Math.round((new Date()).getTime() / 1000);
    var secondsWorked = endTime - startTime;
    console.log('Current work log at: ' + (Math.round(((secondsWorked / 60) * 100)) / 100) + 'mins');
    readline.prompt();
  };

  var handleStart = function() {

  };

  var handlers = {
    '/f' : handleWorkOnFeature.bind(this),
    '/timer' : handleTimerRequest.bind(this),
    // '/start' : handleStart.bind(this),
    '/finish' : handleFinish.bind(this),
    '/log' : handleLog.bind(this),
  };

  return [Object.keys(handlers), api];
})()