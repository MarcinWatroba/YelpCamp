const express = require("express"),
      router  = express.Router(),
      passport = require("passport"),
      User     = require("../models/user");

router.get("/", (req, res) => {
    res.render("home");
});

//=========================
//AUTH ROUTES
//=========================

//register form
router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password)
        .then(user => passport.authenticate("local")(req, res, () => {
            return res.redirect("/campgrounds");
        }))
        .catch(err => {
            console.log(err);
            return res.render("register");
        });

});

//login form
router.get("/login", (req, res) => res.render("login"));

//logging in action
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

//logging out action
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;