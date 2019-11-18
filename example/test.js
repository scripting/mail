const mail = require ("../sendmail.js");

mail.send ("dave.winer@gmail.com", "hello", "This is a kind message", "dave@scripting.com");

var attachments = [
	{
		data: "Oh the buzzing of the tweets.",
		type: "text/html",
		name: "test.html"
		}
	];
mail.send ("dave.winer@gmail.com", "hello", "Message with an attachment", "dave@scripting.com", undefined, attachments);
