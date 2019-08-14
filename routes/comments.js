const express = require("express"),
      router  = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

//new comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
              .then(campground => res.render("comments/new", {camp: campground}))
              .catch(err => console.log(err));
});

//creating new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
    const campID = req.params.id;  
    Campground.findById(req.params.id)
              .then(campground => {
                  return Promise.all([campground, Comment.create(req.body.comment)]);
              })
              .then(async (campground_comment) => {
                   campground_comment[1].author.id = req.user._id;
                   campground_comment[1].author.username = req.user.username;
                   await campground_comment[1].save();
                   await campground_comment[0].comments.push(campground_comment[1]);
                   await campground_comment[0].save();
              })
              .then(() => res.redirect(`/campgrounds/${campID}`))
              .catch(err => res.redirect("/campgrounds"));
});

//EDIT - Show comment edit page
router.get("/:comment_id/edit", middleware.isLoggednAuthorized(Comment, "comment_id"), (req, res) => {
    Comment.findById(req.params.comment_id)
              .then(comment => res.render("comments/edit", {camp_id: req.params.id, comment: comment}))
              .catch(err => console.log(err));
});

//UPDATE - updating comment data
router.put("/:comment_id", middleware.isLoggednAuthorized(Comment, "comment_id"), (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
              .then(() => res.redirect(`/campgrounds/${req.params.id}`))
              .catch(err => console.log(err));
});

//DESTROY - deletes a comment
router.delete("/:comment_id", middleware.isLoggednAuthorized(Comment, "comment_id"), (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
              .then(() => res.redirect(`/campgrounds/${req.params.id}`))
              .catch(err => {
                  console.log(err);
                  return res.redirect("back");
                });
    
    });

module.exports = router;