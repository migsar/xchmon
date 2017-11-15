const WebSocket = require('faye-websocket').Client;

const strings = require('./Strings');
const ERROR = strings.Consumer.ERROR;

class Consumer {
  constructor(address){
    if (!address) {
      throw new Error(ERROR.NO_ADDRESS_GIVEN);
    }
    this.state =  {
      address: address,
      ws: new WebSocket(address)
    };

    init();
  }

  init() {
    const ws = this.state.ws;

    ws.on('open', function(event) {
      console.log('Connected');
      startApp();
    });

    ws.on('message', function(event) {
      console.log('message', event.data);
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      ws = null;
    });

    startApp = function() {
      function subscribe() {
        ws.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
      }

      subscribe();
    }
  }

}

module.exports = Consumer;
