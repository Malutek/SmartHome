var logger = require('./../logger').mailer;
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'smart.home.agh@gmail.com',
        pass: 'TajneHaslo123'
    }
});

function uncapitalize(str) {
    return str[0].toLowerCase() + str.substr(1);
}

function getMailOptions(text, timestamp) {
    var htmlText = '<p>' + text + '. It happened ' + uncapitalize(timestamp) + '.</p>';
    return {
        from: 'Smart Home <smart.home.agh@gmail.com>',
        to: 'malutek+smarthome@gmail.com',
        subject: text,
        html: htmlText
    };
}

function notifyAlarmTrigger(trigger, timestamp) {
    var text = 'Smart Home\'s alarm has been triggered by ' + (trigger ? trigger : 'unknown') + '.';
    var mailOptions = getMailOptions(text, timestamp);
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return logger.error('Error occurred during sending an email. ' + err);
        }
        logger.info('Message sent: ' + info.response);
    });
}

function notifyGasLeakage(timestamp) {
    var text = 'Smart Home has detected gas leakage!';
    var mailOptions = getMailOptions(text, timestamp);
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return logger.error('Error occurred during sending an email. ' + err);
        }
        logger.info('Message sent: ' + info.response);
    });
}

module.exports.notifyAlarmTrigger = notifyAlarmTrigger;
module.exports.notifyGasLeakage = notifyGasLeakage;