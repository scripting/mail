* 11/18/19; 1:20:35 PM by DW
   * Added a new optional param to sendMail, attachment. If present we send the newly-written glue for SES's sendRawEmail.
   * BTW, the interface allows for an array of attachments, but so far we only have it working with a single attachment. 
