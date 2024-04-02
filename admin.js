const express = require("express");
const router = express.Router();
const collection = require("../mongoose");
const session = require('express-session');
const noCache = require('nocache');
router.use(noCache());

const admin = {
  username: "admin",
  password: "123",
};

router.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const checkSession = (req, res, next) => {
  if (req.session && req.session.adminname) {
    return res.redirect('/admindashboard');
  }
  next();
};

router.get("/", checkSession, (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render("admin");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  console.log("userrequest ", req.body);

  if (username === admin.username && password === admin.password) {
    req.session.adminname = username;
    res.redirect("/admindashboard");
  } else {
    res.render("admin", { invalid: true });
  }
});

router.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
});

module.exports = router;
