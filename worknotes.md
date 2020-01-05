* 1/5/20; 10:24:53 AM by DW
   * AWS SES throttles email, limited to 14 messages per second.
      * Clearly I am blowing right through that, they started objecting last night. the best thing to do is to add a queue to davemail that limits it to say 10 per second. Now every app that uses davemail gets the benefit. 
      * Added a new test script that sends multiple emails as fast as is recommended by AWS.
* 11/18/19; 1:20:35 PM by DW
   * Added a new optional param to sendMail, attachment. If present we send the newly-written glue for SES's sendRawEmail.
   * BTW, the interface allows for an array of attachments, but so far we only have it working with a single attachment. 
