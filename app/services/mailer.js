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

function getMailOptions(trigger, timestamp) {
    return {
        from: 'Smart Home <smart.home.agh@gmail.com>',
        to: 'malutek+smarthome@gmail.com',
        subject: 'Smart Home\'s alarm has been triggered!',
        html: '<p>Smart Home\'s alarm has been triggered by ' + trigger + '. It happened ' + uncapitalize(timestamp) + '</p>'
    };
}

function sendMail(trigger, timestamp) {
    var mailOptions = getMailOptions(trigger, timestamp);
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return logger.error('Error occurred during sending an email. ' + err);
        }
        logger.info('Message sent: ' + info.response);
    });
}

module.exports.sendMail = sendMail;