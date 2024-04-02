const express = require("express");
const router = express.Router();
const collection = require("../mongoose");
const session = require('express-session');
const noCache = require('nocache');
router.use(noCache());


router.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const checkSession = (req, res, next) => {
  if (req.session && req.session.username) {
    return res.redirect('/home');
  }
  next();
};

router.get("/", (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.redirect("/login");
});

router.get("/login", checkSession, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await collection.findOne({ username: username });

    if (user && password === user.password) {
      req.session.username = username;
      res.redirect("/home");
    } else {
      res.render("login", { invalid: true });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/home", (req, res) => {
  if (req.session && req.session.username) {
    res.render("home", { username: req.session.username });
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error:", err);
    }
    res.redirect("/login");
  });
});

router.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

module.exports = router;
