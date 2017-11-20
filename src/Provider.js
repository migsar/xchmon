const WebSocket = require('faye-websocket').Client;

const strings = require('./Strings');
const ERROR = strings.Consumer.ERROR;
const state = Symbol('state');

class Provider {
  constructor(options, context){
    this[state] = {
    };

    // todo: validate context
    if (context) {
      this[state].context = context;
      this[state].logger = context.getVar('logger') || console;
    }

    this[state].apis = options.apis;
    this[state].apiNames = this.getApiNames(options);
    this.initAPI('websockets');
  }

  getApiNames(options) {
    if (!options.apis) {
      throw new Error(ERROR.NO_APIS_DEFINED);
    }

    // todo: it should instanciate APIs
    return Object.keys(options.apis);
  }

  initAPI(apiName) {
    if (!this[state].apiNames.includes(apiName)){
      // todo: set interpolation for error messages
      throw new Error(ERROR.NO_WS_API_FOUND);
    }

    // todo: this should be made with external recipes/descriptors
    switch (apiName) {
      case 'websockets':
        this.initWs(this[state].apis[apiName]);
        break;
      case 'public':
        break;
      case 'private':
        break;
    }
  }

  initWs(options) {
    if (!options.address) {
      throw new Error(ERROR.NO_ADDRESS_GIVEN);
    }

    const address = options.address;
    const ws = new WebSocket(address);

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

    function startApp() {
      function subscribe() {
        ws.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
      }

      subscribe();      
    }
  }

}

module.exports = Provider;
