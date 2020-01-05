const mail = require ("../sendmail.js");
for (var i = 1; i <= 10; i++) { //send a bunch of emails very quickly
	mail.send ("dave.winer@gmail.com", "Mail #" + i, "Please ignore this message.", "dave@scripting.com");
	}
