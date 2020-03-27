const bcrypt = require("bcryptjs");

const router = require("express").Router();

const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");
const { jwtSecret } = require("../config/secrets.js");

router.post("/register", (req, res) => {
  // implement registration
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;
  console.log(user.password)
  

    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
    .catch(({ name, message, stack, code }) => {
      res.status(500).json({ name, message, stack, code });
    })
    
  });

router.post("/login", (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        req.session.user = {
          id: user.id,
          username: user.username
      };

  


      res.status(200).json({ whats_good: user.username, token })
       

  } else {
      res.status(401).json({ message: 'invalid credentials'})
  }
    })
    .catch(({ name, code, message, stack }) => {
      res.status(500).json({ name, code, message, stack });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: "2h"
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;