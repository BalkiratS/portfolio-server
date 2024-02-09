var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

const storedUsername = process.env.USERNAME;
const storedPasswordHash = bcrypt.hashSync(process.env.PASSWORD, saltRounds);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "You are in the server"})
});

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Compare input credentials with stored credentials
  if (username === storedUsername && bcrypt.compareSync(password, storedPasswordHash)) {
      const token = jwt.sign({ username }, secretKey);
      res.json({ token });
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
