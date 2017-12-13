const Consumer = require('./Consumer');
const Sequelize = require('sequelize');

const TickModel = {
  timestamp: Sequelize.DATE,
  amount: Sequelize.DECIMAL,
  rate: Sequelize.DECIMAL,
  operation: Sequelize.ENUM('buy', 'sell')
};

class SQLConsumer {
  constructor(options) {
    const connectionOptions = {
      dialect: 'postgres'
    };

    this.sequelize = new Sequelize('bitso', 'bitsoadmin', 'bitcoins', connectionOptions);
    this.createModel();
  }

  middleware(tick) {
    this.Tick.create({
      timestamp: tick.timestamp,
      amount: tick.amount,
      rate: tick.rate,
      operation: (tick.operation) ? 'sell' : 'buy'
    }).then( () => {
      console.log(tick);
    });
  }

  createModel() {
    // todo: should use the same model for tick as provider
    this.Tick = this.sequelize.define('tick', TickModel, {
      tableName: 'btc_mxn'
    });
  }

}

module.exports = SQLConsumer;
