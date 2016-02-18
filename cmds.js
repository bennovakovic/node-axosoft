

module.exports = {
  '/exit' : function() {
    process.exit(0);
  },
  '/help' : function() {
    console.log('> List the help commands here...');
    console.log('> List the help commands here...');
    console.log('> List the help commands here...');
    console.log('> List the help commands here...');
    console.log('> List the help commands here...');
    console.log('> List the help commands here...');
    return;
  },
  '/?' : function() {
    console.log('> List the help commands here...');
    return;
  },
  '/test' : function() {
    console.log('working yo...', arguments);
    var Spinner = require('cli-spinner').Spinner;

    var spinner = new Spinner('%s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    setTimeout(function() {
      spinner.stop(true);
      console.log('here are the results...');
      var notifier = require('node-notifier');
      var nc = new notifier.NotificationCenter();

      nc.notify({
        'title': 'Phil Coulson',
        'subtitle': 'Agent of S.H.I.E.L.D.',
        'message': 'If I come out, will you shoot me? \'Cause then I won\'t come out.',
        'sound': 'Glass', // case sensitive
        'appIcon': __dirname + '/coulson.jpg',
        'contentImage': __dirname + '/coulson.jpg',
        'open': 'file://' + __dirname + '/coulson.jpg',
        'wait' : true
      });
      // var request = require('./axo/request.js');
      // request().get();
    }, 1000);
  }
}