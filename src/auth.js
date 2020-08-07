'use strict'

const jwt = require('jsonwebtoken')

const JWT_SECRET = "abcdefg123"

function generateToken(user) {

  if (!user) return null;

  var payload = {
    email: user.email,
    name: user.name
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: 60 * 60 // expires in 1 hours
  });
}

async function authenticate(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  try {
    if (token) {
      token = token.replace('Bearer ', '');
      let user = await jwt.verify(token, JWT_SECRET)
      req.user = user;
      console.log(user)
      next();
    } else {
      res.status(401).send({
        error: "NOT_AUTHENTICATED",
        message: "Invalid user."
      })
    }
  } catch (err) {
    res.status(401).send({
      error: "NOT_AUTHENTICATED",
      message: "Invalid user."
    })
  }
}


module.exports = {
  generateToken,
  authenticate
}