const winston = require('winston');
const chalk = require('chalk');
const Context = require('./Context');
const Provider = require('./Provider/Provider');
const Consumer = require('./Consumer/Consumer');
const SQLConsumer = require('./Consumer/SQLConsumer');

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

  addProvider(providerDescriptor) {
    this[state].providers.push(new Provider(providerDescriptor, this[state].context));
  }

  start() {
    const providers = this[state].providers;

    // todo: use logger with chalk
    console.log(chalk.blue('Xchmon started...'));

    providers.forEach( provider => {
      console.log(chalk.yellow(`Starting ${provider.name} provider.`));
      const consumer = new SQLConsumer();
      provider.subscribe( consumer.middleware.bind(consumer) );
      provider.start();
    });
  }
}

module.exports = App;
