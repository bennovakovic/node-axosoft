module.exports = function() {

  var handlers = {};
  for(var a in arguments) {
    for(var h in arguments[a][0]) {
      // console.log(arguments[a][0][h]);
      handlers[arguments[a][0][h]] = arguments[a][1];
    }
  }

  var api = {};

  api.routes = handlers;


  api.process = function(rl, input) {
    if(input.length === 0) {
      return;
    }
    if(input.charAt(0) !== '/') {
      handleProcessResponse(new Error('Invalid command, must begin with /'));
      return;
    }

    var cmdSegs = input.split(' ');
    if(handlers[cmdSegs[0]]) {
        handleProcessResponse(null, handlers[cmdSegs[0]].route, cmdSegs, rl);
        return;
    }
    // for(var cmd in cmdList) {
    //   // if we have a matching command
    //   if(cmdSegs[0] === cmd) {
    //     handleProcessResponse(null, cmdList[cmd], cmdSegs);
    //     return;
    //   }
    // }
    process.stdout.write(input + ' >> output...\r');
    handleProcessResponse(new Error('Invalid command.'));
    return;
  };

  var handleProcessResponse = function(err, func, args, readline) {
    if(err) {
      console.log(err.toString());
      // process.stdout.write('Error: ', err.toString());
    }
    else {
      var argArgs = [
        {readline : readline},
        args
      ]
      func.apply(null, argArgs);
    }

  }

  return api;
}