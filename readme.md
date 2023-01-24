# mail

One place to send mail from all my Node apps. 

### Features

* I was scattering this code everywhere. Now I have a <a href="https://www.npmjs.com/package/davemail">package</a>. 

* It builds on <a href="#using-with-smtp">SMTP</a> or <a href="https://aws.amazon.com/ses/">Amazon's SES</a>. 

* One routine for all your mail-sending needs: mail.send.

* Limits mail sending to 10 messages per second, to comply with AWS's rate limits. It keeps a queue so you can call it as fast as you like. 

* I use this code to send the <a href="http://scripting.com/email/">nightly emails</a> from Scripting News. 

### Example

```javascript

const mail = require ("davemail");

mail.send (recipient, subject, message, sender);

```

### Using with SMTP

The first versions of this package only worked with SES, which was fine because that was all I needed. But this package is now part of FeedLand and we want to be able to send mail with SMTP so have added this ability. This is how you set it up.

There's a new function <i>mail.start.</i> It takes one param, options, a JavaScript object. 

You only have to call mail.start if you're using SMTP, otherwise it will send mail via SES, so there's no breakage for older apps. 

Here are the values that must be present in the options object:

* flUseSes: if true we use Amazon SES and ignore the other values. If false we use SMTP. Default true, to preserve backward compatibility. 

* smtpHost: the domain name or IP address of the mail server.

* port: the port the mail server is running on.

* username: the account associated with the email sending priviledge. 

* password: the password for the account. 

Attachments are not supported for SMTP at this time. 

