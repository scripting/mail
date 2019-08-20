const myProductName = "davemail", myVersion = "0.4.3"; 

const AWS = require ("aws-sdk");
const utils = require ("daveutils");

var ses = new AWS.SES ({
	apiVersion: "2010-12-01",
	region: "us-east-1"
	});

exports.send = sendMail;

function sendMail (recipient, subject, message, sender, callback) {
	var theMail = {
		Source: sender,
		ReplyToAddresses: [sender],
		ReturnPath: sender,
		Destination: {
			ToAddresses: [recipient]
			},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8", 
					Data: message
					},
				Text: {
					Charset: "UTF-8", 
					Data: utils.stripMarkup (message)
					}
				},
			Subject: {
				Data: subject
				}
			},
		};
	ses.sendEmail (theMail, function (err, data) { 
		if (err) {
			console.log ("\nsendMail: err.message == " + err.message);
			}
		else {
			console.log ("\nsendMail: data == " + JSON.stringify (data, undefined, 4));
			}
		if (callback !== undefined) { //8/18/19 by DW
			callback (err, data);
			}
		});
	}
