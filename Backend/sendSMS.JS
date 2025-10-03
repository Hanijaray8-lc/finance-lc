require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Test message from Twilio app',
    from: process.env.TWILIO_PHONE,
    to: '+919976577532'
  })
  .then(message => console.log(`✅ SMS sent! SID: ${message.sid}`))
  .catch(error => console.error(`❌ Error: ${error.message}`));
