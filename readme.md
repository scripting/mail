# mail

One place to send mail from all my Node apps. 

* I was scattering this code everywhere. Now I have a <a href="https://www.npmjs.com/package/davemail">package</a>. 

* It builds on <a href="https://aws.amazon.com/ses/">Amazon's SES</a>. 

* One routine for all your mail-sending needs: mail.send.

* Limits mail sending to 10 messages per second, to comply with AWS"s rate limits. It keeps a queue so you can call it as fast as you like. 

* I use this code to send the <a href="http://scripting.com/email/">nightly emails</a> from Scripting News. 

### Example

```javascript

const mail = require ("davemail");

mail.send (recipient, subject, message, sender);

```

