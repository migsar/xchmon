require('dotenv').config();
const { join } = require('path');
const App = require('./src/App');
const bitso = require('./src/xchs/bitso.json');

const logDir = process.env['LOG_DIR'] || 'logs';
const logFile = process.env['LOG_FILE'] || 'app.log';
const app = new App();

app.configureLogger({
  level: process.env['LOG_LEVEL'] || 'prod',
  file: join(__dirname, logDir, logFile)
});
app.addProvider(bitso);
app.start();
