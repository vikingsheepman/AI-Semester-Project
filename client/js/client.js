// Brian Maher
// Killian Smith
// CSCI446
// client.js
//     - This file contains the client-side connection code for maintaining
//       a connection with the game-logic server

// node.js server
var net = require('net');

// server information
var HOST = '127.0.0.1';		// server IP
var PORT = 6666;			// server port

// create a new socket
var client = new net.Socket();

// initializing the connection
client.connect(PORT, HOST, function() {
	console.log('Connected to server at ' + HOST + ':' + PORT);
});

// event handler for when clientSock receives data from the server
client.on('data', function(data) {
	console.log('DATA: ' + data);
});

// event handler for when the connection between client and server are closed
client.on('close', function() {
	console.log('Closed connection.');
});