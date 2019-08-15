const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

  
//INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find().then(campgrounds => res.render("campgrounds/index", {camps: campgrounds}))
                     .catch(err => console.log(err));
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, (req, res) => {

    const newCamp = req.body.campground;
    newCamp.author = author = {
      id: req.user._id,
      username: req.user.username
    };

    Campground.create(newCamp)
              .then(() => {
                  req.flash("success", "Successfully added a new campground");
                  return res.redirect("/campgrounds");
                })
              .catch(err => console.log(err))
});

//NEW - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - view more information about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
              .populate("comments")
              .then(campground => {
                  if(campground)
                    return res.render("campgrounds/show", {camp: campground});
                  else
                    {
                        req.flash("error", "Something went wrong");
                        return res.redirect("back");
                    }
                })
              .catch(err => {
                  console.log(err);
                  return res.redirect("/campgrounds");
                });
});

//EDIT - form for editing a campground
router.get("/:id/edit", middleware.isLoggednAuthorized(Campground, "id"), (req, res) => {
    Campground.findById(req.params.id)
              .then(campground => res.render("campgrounds/edit", {camp: campground}))
              .catch(err => console.log(err));
});

//UPDATE - updating campground data
router.put("/:id", middleware.isLoggednAuthorized(Campground, "id"), (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
              .then(updCamp => {
                  req.flash("success", "Successfully edited your campground");
                  return res.redirect(`/campgrounds/${updCamp._id}`);
                })
              .catch(err => {
                  req.flash("error", "Something went wrong");
                  console.log(err);
                });
});

//DESTROY - deletes a campground
router.delete("/:id", middleware.isLoggednAuthorized(Campground, "id"), (req, res) => {
Campground.findByIdAndRemove(req.params.id)
          .then(deletedCamp => Comment.deleteMany({'_id': { $in: deletedCamp.comments}}))
          .then(deleted => {
              req.flash("success", "Successfully deleted your campground");
              return res.redirect("/campgrounds");
          })
          .catch(err => {
              console.log(err);
              return res.redirect("/campgrouds");
          });
});

module.exports = router;