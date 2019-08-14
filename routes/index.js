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
            req.flash("success", `Registration Successful, welcome ${user.username}`);
            return res.redirect("/campgrounds");
        }))
        .catch(err => {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
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
    req.flash("success", "Succesfully logged out");
    res.redirect("back");
});

module.exports = router;