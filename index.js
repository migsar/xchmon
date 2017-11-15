const App = require('./src/App');
const bitso = require('./src/xchs/bitso.json');

const app = new App();

app.configureLogger({
  level: 'debug',
  file: 'logs/app.log'
});
app.addConsumer(bitso);
app.start();
