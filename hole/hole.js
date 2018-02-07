require('fast-text-encoding');
const WebSocket = require('ws');
const readline = require('readline');

const url = process.argv[2] || process.env['CRUISE_HOLE_WS'];
const authtoken = process.env['CRUISE_HOLE_AUTHTOKEN'];
const cmd = process.argv[3];
const textEncoder = new TextEncoder();
const ws = new WebSocket(url, ['tty']);
const tty = readline.createInterface({
   input: process.stdin,
   prompt: ''
});

function send(data) {
   ws.send(textEncoder.encode(data));
}

tty.on('line', function (line) {
   send('0' + line + '\n');
});

ws.on('open', function () {
   send(JSON.stringify({AuthToken: authtoken || null}));
   if (cmd) {
      send('0' + cmd + ' && exit || exit\n')
   } else {
      process.stdout.write('Welcome to Cruise Hole ...\n');
      tty.prompt();
   }
});

ws.on('message', function (buf) {
   buf = buf.toString();
   op = buf.substring(0, 1);
   if (op === '0')
      process.stdout.write(buf.substring(1));
   if (!cmd) tty.prompt();
});

ws.on('close', function () {
   process.exit(0);
});
