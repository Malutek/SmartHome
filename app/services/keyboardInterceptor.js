var keypress = require('keypress');

function hook(char, callback) {
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.name === char) {
            callback();
        }
    });
}

if (process.stdin.setRawMode !== undefined) {
    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name === 'c') {
            process.exit();
        }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
}

module.exports.hook = hook;