var readLine = require('./lib/read_line');
var CmdProcessor = require('./lib/cmd_processor');
var cmdlist = require('./cmds');

var axoItems = require('./axo/items');


// main app
(function(){

  // var handlers = [axoItems];
  // var handlerList = [];
  // for(var i in cmds) {
  //   handlerList = handlerList.concat(cmds[i][0]);
  // }

  // console.log(axoItems);
  var cmdProcessor = new CmdProcessor(axoItems);
  var readline = readLine(Object.keys(cmdProcessor.routes), cmdProcessor.process);
})();