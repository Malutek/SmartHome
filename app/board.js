var five = require("johnny-five");
var Galileo = require("galileo-io");
var board = new five.Board({
    io: new Galileo()
});

var led;

function run() {
    board.on("ready", function () {
        led = new five.Led(13);
        console.log('Galileo ready.');
    });
}

function turnOn() {
    led.on();
}

function turnOff() {
    led.off();
}

module.exports.run = run;
module.exports.turnOn = turnOn;
module.exports.turnOff = turnOff;