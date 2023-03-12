const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
  
// Set up Global configuration access
dotenv.config();
  
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});

// Generating JWT
const generateToken = (req, res) => {
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      invoiceId: 10,
      rand: require('crypto').randomBytes(32).toString('hex')
    }
  
    const token = jwt.sign(data, jwtSecretKey);
  
    res.send(token);
  }
  
  // Use it in the endpoint
  app.post("/user/generateToken", generateToken);

  //module.exports = { generateToken };
  exports.generateToken = generateToken;
  
// generate token
//curl -X POST http://localhost:5000/user/generateToken
