var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://ws.bitso.com/', 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');

    startApp();
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};

startApp = function() {
  function subscribe() {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
      }
  }

  subscribe();
}
