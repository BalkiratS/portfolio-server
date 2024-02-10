var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var getSecret = require('../secrets')


// get message from the form
router.post('/', async function(req, res) {

    const {name, email, message} = req.body;
    
    // Send email notification
  try {

    const secretValue = await getSecret("pserver/email");

    const emailUser = secretValue.EMAIL_USER;
    const emailPass =  secretValue.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass, 
      },
    });

    const mailOptions = {
      from: emailUser, 
      to: emailUser,
      subject: 'New Message from Contact Form',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully.');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }

    res.status(200).send('Message received successfully!');

})

module.exports = router
