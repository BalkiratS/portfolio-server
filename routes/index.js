var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const getSecret = require('../secrets')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "You are in the server"})
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Get stored credentials
    try {
      const secretValue = await getSecret("pserver/admin-creds");
      const secretValue2 = await getSecret("pserver/secret-key");

      const storedUsername = secretValue.USERNAME;
      const storedPasswordHash =  secretValue.PASSWORD;
      const secretKey = secretValue2.SECRET_KEY;
      // Compare input credentials with stored credentials
      if (username === storedUsername && bcrypt.compareSync(password, storedPasswordHash)) {
          const token = jwt.sign({ username }, secretKey);
          res.json({ token });
      } else {
          res.status(401).json({ message: 'Unauthorized' });
      }
  
    } catch (error) {
      console.error(`Error accessing secret: ${error}`);
    }

  });
  

module.exports = router;
