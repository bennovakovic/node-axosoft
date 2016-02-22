var readLine = require('./lib/read_line');
var CmdProcessor = require('./lib/cmd_processor');
var settings = require('./settings');

var axoAuth = require('./axo/auth');
var axoMe = require('./axo/me');
var axoItems = require('./axo/items');

var help = require('./help');

var axoTest = require('./axo/test');


// main app
(function(){

  // var handlers = [axoItems];
  // var handlerList = [];
  // for(var i in cmds) {
  //   handlerList = handlerList.concat(cmds[i][0]);
  // }

  // console.log(axoItems);
  var cmdProcessor = new CmdProcessor(axoAuth, axoMe, axoItems, help, axoTest);
  var readline = readLine(Object.keys(cmdProcessor.routes), cmdProcessor.process);
})();