const express = require("express"),
      router  = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");

//new comment form
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
              .then(campground => res.render("comments/new", {camp: campground}))
              .catch(err => console.log(err));
});

//creating new comment
router.post("/", isLoggedIn, (req, res) => {
    const campID = req.params.id;  
    Campground.findById(req.params.id)
              .then(campground => {
                  return Promise.all([campground, Comment.create(req.body.comment)]);
              })
              .then(async (campground_comment) => {
                   await campground_comment[0].comments.push(campground_comment[1]);
                   await campground_comment[0].save();
              })
              .then(() => res.redirect(`/campgrounds/${campID}`))
              .catch(err => res.redirect("/campgrounds"));
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;