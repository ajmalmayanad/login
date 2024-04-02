const express = require("express");
const router = express.Router();
const collection = require("../mongoose");
const noCache = require('nocache');
router.use(noCache());

const checkSession = (req, res, next) => {
  if (req.session && req.session.username) {
      return res.redirect('/home');
  }
  next();
};

router.get("/",checkSession,function (req, res, next) {
  res.render("signup");
});
router.post("/", async (req, res) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  let user1 = await collection.findOne({
    username: data.username
  });
  let user2 = await collection.findOne({
    email: data.email
  });
  if(user1!=null){
    res.render("signup", { usernameExists: true });
  }else if(user2!=null){
    res.render("signup", { emailExists: true });
  }else{
    await collection.insertMany([data]);
    req.session.username=data.username;
    console.log(data.username)
    res.render("home",{user:data.username});
  }

  
});

module.exports = router;
