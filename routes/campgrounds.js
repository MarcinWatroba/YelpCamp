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
    const newName = req.body.camp;
    const newImage = req.body.img;
    const newDesc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCamp =  {name: newName, image: newImage, description: newDesc, author: author};

    Campground.create(newCamp)
              .then(() => res.redirect("/campgrounds"))
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
              .exec()
              .then(campground => {
                  res.render("campgrounds/show", {camp: campground});
                })
              .catch(err => console.log(err));
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
              .then(updCamp => res.redirect(`/campgrounds/${updCamp._id}`))
              .catch(err => console.log(err));
});

//DESTROY - deletes a campground
router.delete("/:id", middleware.isLoggednAuthorized(Campground, "id"), (req, res) => {
Campground.findByIdAndRemove(req.params.id)
          .then(deletedCamp => Comment.remove({author: {id: deletedCamp.author.id}}))
          .then(() => res.redirect("/campgrounds"))
          .catch(err => {
              console.log(err);
              return res.redirect("/campgrouds");
            });

});

module.exports = router;