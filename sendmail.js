const myProductName = "davemail", myVersion = "0.4.7"; 

const AWS = require ("aws-sdk");
const utils = require ("daveutils");

var ses = new AWS.SES ({
	apiVersion: "2010-12-01",
	region: "us-east-1"
	});

exports.send = sendMail;
exports.sendRawEmail = sendRawEmail; //11/18/19 by DW

function sendRawEmail (recipient, subject, message, sender, attachments, callback) { //11/18/19 by DW
	var mailtext = "";
	function add (s) {
		mailtext += s + "\n";
		}
	
	add ("From: " + sender);
	add ("To: " + recipient);
	add ("Subject: " + subject);
	add ("MIME-Version: 1.0");
	add ("Content-Type: multipart/mixed; boundary=\"NextPart\"\n");
	add ("--NextPart");
	add ("Content-Type: text/html\n");
	add (message + "\n");
	add ("--NextPart");
	if (attachments !== undefined) {
		attachments.forEach (function (item) {
			add ("Content-Type: " + item.type + "; name=\"" + item.name + "\"");
			add ("Content-Transfer-Encoding: base64");
			add ("Content-Disposition: attachment");
			add (item.data.toString ("base64") + "\n");
			add ("--NextPart--");
			});
		}
	
	var params = {
		RawMessage: {Data: mailtext},
		Source: "dave@scripting.com"
		};
	
	ses.sendRawEmail (params, function (err, data) {
		if (err) {
			console.log ("\nsendRawEmail: err.message == " + err.message);
			}
		if (callback !== undefined) { 
			callback (err, data);
			}
		});
	}
function sendMail (recipient, subject, message, sender, callback, attachments) {
	if (attachments === undefined) {
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
			if (callback !== undefined) { //8/18/19 by DW
				callback (err, data);
				}
			});
		}
	else {
		sendRawEmail (recipient, subject, message, sender, attachments, callback);
		}
	}
