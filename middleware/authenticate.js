const jwt = require('jsonwebtoken');
const getSecret = require('../secrets')




function authMiddleware(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    (async () => {
        try {
          const secretValue = await getSecret("pserver/secret-key");
          const secretKey = secretValue.SECRET_KEY;
        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = user;
            next();
            });
      
        } catch (error) {
          console.error(`Error accessing secret: ${error}`);
        }
      })();
    

    
}

module.exports = authMiddleware;
