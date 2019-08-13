const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find().then(campgrounds => res.render("campgrounds/index", {camps: campgrounds}))
                     .catch(err => console.log(err));
});

//CREATE - add new campground to db
router.post("/", (req, res) => {
    const newName = req.body.camp;
    const newImage = req.body.img;
    const newDesc = req.body.description;
    Campground.create({name: newName, image: newImage, description: newDesc})
              .then(res.redirect("/campgrounds"))
              .catch(err => console.log(err))
});

//NEW - show form to create new campgrounds
router.get("/new", (req, res) => {
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

module.exports = router;