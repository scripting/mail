const myProductName = "davemail", myVersion = "0.5.4"; 

exports.start = start; //1/23/23 by DW
exports.send = sendMail;
exports.sendRawEmail = sendRawEmail; //11/18/19 by DW

const AWS = require ("aws-sdk");
const utils = require ("daveutils");
const nodemailer = require ("nodemailer");

var ses = new AWS.SES ({
	apiVersion: "2010-12-01",
	region: "us-east-1"
	});

var config = { //1/23/23 by DW
	flUseSes: true
	};

var mailTransport; //1/23/23 by DW

const maxMailsPerSec = 10;  //1/5/20 by DW -- there's now a queue that limits mail to ten per second
var mailQueue = new Array ();
var flQueueThreadRunning = false; 
var mailQueueInterval;  

function checkMailQueue () {
	if (mailQueue.length > 0) {
		var item = mailQueue.shift (); //remove first element
		sendActualMail (item.recipient, item.subject, item.message, item.sender, item.callback, item.attachments);
		}
	else {
		if (flQueueThreadRunning) {
			clearInterval (mailQueueInterval);
			flQueueThreadRunning = false;
			}
		}
	}
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
function sendActualMail (recipient, subject, message, sender, callback, attachments) {
	if (attachments === undefined) {
		if (config.flUseSes) {
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
			const mailOptions = {
				to: recipient,
				subject,
				html: message,
				text: utils.stripMarkup (message),
				from: sender
				};
			mailTransport.sendMail (mailOptions, function (err, data) {
				if (err) {
					console.log ("\nsendMail: err.message == " + err.message);
					}
				if (callback !== undefined) { 
					callback (err, data);
					}
				});
			}
		}
	else {
		sendRawEmail (recipient, subject, message, sender, attachments, callback);
		}
	}
function sendMail (recipient, subject, message, sender, callback, attachments) {
	mailQueue.push ({
		recipient, subject, message, sender, callback, attachments
		});
	if (!flQueueThreadRunning) {
		flQueueThreadRunning = true;
		mailQueueInterval = setInterval (checkMailQueue, 1000 / maxMailsPerSec); 
		}
	}
function start (options) { //1/23/23 by DW
	var flUseSes = (options.flUseSes === undefined) ? true : utils.getBoolean (options.flUseSes);
	config.flUseSes = flUseSes; //so davemail routines know whether to use SMTP or SES
	if (!flUseSes) { //using SMTP
		const nodemailerOptions = {
			host: options.smtpHost,
			port: options.port,
			secure: (options.port == 465),
			auth: {
				user: options.username,
				pass: options.password
				}
			};
		mailTransport = nodemailer.createTransport (nodemailerOptions);
		}
	}
