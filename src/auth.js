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
  
   
  module.exports = {
    generateToken
  }