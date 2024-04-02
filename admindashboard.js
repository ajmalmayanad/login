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

const isAuthenticated = (req, resp, next) => {
  if (req.session && req.session.adminname) {
    return next();
  } else {
    resp.redirect('/admin');
  }
};

router.get("/", isAuthenticated, async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const users = await collection.find({});
  res.render("admindashboard", { users });
});

router.get("/userControl/", isAuthenticated, (req, res) => {
  res.render("userControl");
});

router.post("/userControl", isAuthenticated, async (req, res) => {
  
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
    res.render("userControl", { usernameExists: true });
  }else if(user2!=null){
    res.render("userControl", { emailExists: true });
  }else{
    await collection.insertMany([data]);
    res.redirect("/admindashboard");
  }
});

router.get("/delete-user/", isAuthenticated, async (req, res) => {
  let proId = req.query.id;
  await collection.deleteOne({ _id: proId });
  res.redirect("/admindashboard");
});

router.get("/edit-user/", isAuthenticated, async (req, res) => {
  let proId = req.query.id;
  const user = await collection.findOne({ _id: proId });
  res.render("editUser", { user });
});

router.post("/edit-user", isAuthenticated, async (req, res) => {
  const proId = req.query.id;
  const { username, email, password } = req.body;

  await collection.updateOne(
    { _id: proId },
    { $set: { username, email, password } }
  );
  res.redirect("/admindashboard");
});

router.get('/signout', (req, resp) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    resp.redirect('/admin');
  });
});

router.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

module.exports = router;
