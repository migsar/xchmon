const winston = require('winston');
const Context = require('./Context');

const state = Symbol('state');

class App{
  constructor(){
    this[state] = {};
    this.configureContext();
  }

  configureLogger(options) {
    // todo: logs directory must exist or log is not created and no message is displayed
    this[state].logger = winston.createLogger({
      level: options.level,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: options.file
        })
      ]
    });
  }

  configureContext() {
    this[state].context = new Context;
  }

  addConsumer() {

  }

  start() {
    this[state].logger.info('Xchmon started...');
  }
}

module.exports = App;
