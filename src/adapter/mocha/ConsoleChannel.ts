const { remote: rmt } = require('electron');
const rmtConsole = rmt.require('console');
let isRemoteConsole = false;


export default class ConsoleChannel {
  static remote(){
    if(isRemoteConsole) return;
    isRemoteConsole = true;
  // we have to do this so that mocha output doesn't look like shit
    console.log = function () {
      rmtConsole.log.apply(rmtConsole, arguments)
    };

    console.dir = function () {
      rmtConsole.dir.apply(rmtConsole, arguments)
    };

    // if we don't do this, we get socket errors and our tests crash
    Object.defineProperty(process, 'stdout', {
      value: rmt.process.stdout
    });
  }
}