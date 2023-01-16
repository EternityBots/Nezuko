var forever = require("forever-monitor");

var child = new forever.Monitor("heart.js", {
  silent: false,
});
child.start();
