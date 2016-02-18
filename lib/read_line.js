var readline = require('readline');

module.exports = function(cmds, callback) {

  function completer(line) {
    // show all completions if none found
    return [cmds, line]
  }


  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    completer : completer
  });
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', function (cmd) {
    // console.log('You just typed: '+cmd);
    // process.stdout.write("Downloading " + cmd + " bytes\r");
    // process.stdout.write("Downloading " + cmd + " / " + new Date() + " bytes\r");
    callback(rl, cmd);
    rl.prompt();
  });
}