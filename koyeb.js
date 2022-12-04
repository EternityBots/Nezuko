var forever = require('forever-monitor');

var child = new (forever.Monitor)('heart.js', {
  silent: false,
});

child.on('exit', function () {
  console.log('Bot has exited after 10 restarts');
});

child.start();