const chalk = require('chalk');

class Consumer {
  constructor() {

  }

  middleware(tick) {
    // bitso 0 buy 1 sell
    const color = (tick.operation) ? chalk.red : chalk.green;
    console.log( color(tick.rate) + '...' + tick.amount );
  }
}

module.exports = Consumer;
