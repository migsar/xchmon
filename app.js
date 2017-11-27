var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('wss://ws.bitso.com', []);

client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');
    startApp();
};

client.onclose = function () {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function (message) {
    var data = JSON.parse(message.data);
    /**
     * Trade Payload
     * i = Integer: counter
     * a = String: # BTC
     * r = String: precio en MXN
     * v = String: a * r
     * t = Integer: (1 = tradeout | 0 = tradein)
     * mo = String: ?
     * to = String: ?
     */
    if (data.type == 'trades' && data.payload) {

        console.log("Received a tarde!");
        for (var i in data.payload) {
            var trade = data.payload[i];

            var output = '[' + trade['i'] + '] ' + trade['a'] + ' BTC @ ' + trade['r'] + ' MXN = ' + trade['v'] + ' MXN';
            console.log(output);
        }
    }
    //else if (data.type == 'diff-orders' && data.payload) {
    //
    //}
    //else if (data.type == 'orders' && data.payload) {
    //    
    //}
    //data.type == 'diff-orders'
    //data.type == 'ka'
};

startApp = function () {
    function subscribe() {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({
                action: 'subscribe',
                book: 'btc_mxn',
                type: 'trades'
            }));
            //client.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'diff-orders' }));
            //client.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
        }
    }

    subscribe();
}
