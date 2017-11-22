const WebSocket = require('faye-websocket').Client;

const strings = require('../Strings');
const ERROR = strings.Consumer.ERROR;
const state = Symbol('state');

class Provider {
  constructor(options, context){
    this[state] = {
      consumers: [],
      factory: null,
      ws: null
    };

    // todo: validate context
    if (context) {
      this[state].context = context;
      this[state].logger = context.getVar('logger') || console;
    }

    this[state].name = options.name || 'unknown';
    this[state].apis = options.apis;
    this[state].apiNames = this.getApiNames(options);
    this.initAPI('websockets');
  }

  get name() {
    return this[state].name;
  }

  /**
   * Emits a message to all consumers of this provider
   * @param {object} message - Tick object.
   */
  emit(message) {
    this[state].consumers.forEach( consumer => {
      consumer(message);
    });
  }

  /**
   * Subscribes a consumer to this provider
   */
  subscribe(consumer, options) {
    // todo: options can be filters or maps
    this[state].consumers.push(consumer);
  }

  /**
   * Creates the connection and start listening
   * Emits events to subscribed consumers
   */
  start() {
    // todo: make this an observable (rxjs) to allow operations on it
    if (this[state].ws) {
      throw new Error(ERROR.PROVIDER_ALREADY_STARTED);
    }
    this[state].ws = this[state].factory.next();
  }

  /**
   * Stops listening and close the connection
   * Stops emitting events to subscribed consumers
   */
  stop() {
    if (this[state].ws) {
      throw new Error(ERROR.PROVIDED_NOT_RUNNING);
    }

  }

  /**
   * Continues listening but stops emitting events to subscribed consumers.
   */
  pause() {
    // todo
  }

  /**
   * Restarts emitting events to subcribed consumers
   */
  resume() {
    // todo
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
    // todo: use subclasses extending from provider to each of these
    switch (apiName) {
      case 'websockets':
        this[state].factory = this.initWs(this[state].apis[apiName]);
        break;
      case 'public':
        // this[state].factory = this.initWs(this[state].apis[apiName]);
        break;
      case 'private':
        // this[state].factory = this.initWs(this[state].apis[apiName]);
        break;
    }
  }

  initWs(options) {
    if (!options.address) {
      throw new Error(ERROR.NO_ADDRESS_GIVEN);
    }
    const address = options.address;
    const that = this;

    // todo: add in another function with validation
    const tickOptions = {
      // todo: skip object with this predicate
      skip: {
        type: 'ka'
      },
      map: options.subscription.trades.response
    };

    function processMessage(data){
      // todo: set tracing messages for debug only
      switch (data.type) {
        case 'trades':
          if (data.payload) {
            data.payload.forEach( tick => {
              that.emit(new Tick(tick, tickOptions));
            });
          }
          break;
        case 'ka':
        default:
          break;
      }

    }

    const generator = function* () {
      let ws;
      while(true) {
        ws = new WebSocket(address);

        ws.on('open', function(event) {
          console.log('Connected');
          // todo: we should fulfill a promise or something here
          ws.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
        });

        ws.on('message', function(event) {
          processMessage(JSON.parse(event.data));
        });

        ws.on('close', function(event) {
          console.log('close', event.code, event.reason);
          ws = null;
        });

        yield ws
      }
    };

    return generator();
  }
}

class Tick {
  constructor(data, options) {
    this.timestamp = (new Date).valueOf();
    this.assign(data, options.map);
  }

  assign(props, map) {
    for(let prop in props){
      this[map[prop]] = props[prop];
    };
  }
}

module.exports = Provider;
