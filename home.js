const express = require('express');
const router = express.Router();
const collection = require('../mongoose');
const session = require('express-session');
const noCache = require('nocache');
router.use(noCache());

router.use(function(req, res, next) { 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

const isAuthenticated = (req, resp, next) => {
    if (req.session && req.session.username) {
        return next();
    } else {
        resp.redirect('/login');
    }
};

router.get('/', isAuthenticated, async (req, resp) => {
    resp.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    resp.render('home');
});

router.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});


module.exports = router;
