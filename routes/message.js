var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
require('dotenv/config')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });
  


// get message from the form
router.post('/', async function(req, res) {

    const {name, email, message} = req.body;
    
    // Send email notification
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: process.env.EMAIL_USER,
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
