const winston = require('winston');
const chalk = require('chalk');
const Context = require('./Context');
const Provider = require('./Provider');

const state = Symbol('state');

class App{
  constructor(){
    this[state] = {
      providers: [],
      consumers: []
    };
    this.configureContext();
  }

  configureLogger(options) {
    // todo: logs directory must exist or log is not created and no message is displayed
    const logger = winston.createLogger({
      level: options.level,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: options.file
        })
      ]
    });

    this[state].context.setVar('logger', logger);
  }

  configureContext() {
    this[state].context = new Context;
  }

  addProvider(providerOptions) {
    this[state].providers.push(new Provider(providerOptions, this[state].context));
  }

  start() {
    // todo: use logger
    console.log(chalk.blue('Xchmon started...'));
  }
}

module.exports = App;
