const express    = require("express"),
      app        = express(),
      request    = require("request-promise"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      seedDB     = require("./seeds");
      
    //   User       = require("./models/user")
    //   Comment    = require("./models/comment"),

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", (req, res) => {
    res.render("home");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find().then(campgrounds => res.render("campgrounds/index", {camps: campgrounds}))
                     .catch(err => console.log(err));
});

//CREATE - add new campground to db
app.post("/campgrounds", (req, res) => {
    const newName = req.body.camp;
    const newImage = req.body.img;
    const newDesc = req.body.description;
    Campground.create({name: newName, image: newImage, description: newDesc})
              .then(res.redirect("/campgrounds"))
              .catch(err => console.log(err))
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - view more information about one campground
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id)
              .populate("comments")
              .exec()
              .then(campground => {
                  res.render("campgrounds/show", {camp: campground});
                })
              .catch(err => console.log(err));
});

//=========================
//COMMENTS ROUTES
//=========================

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id)
              .then(campground => res.render("comments/new", {camp: campground}))
              .catch(err => console.log(err));
});

app.post("/campgrounds/:id/comments", (req, res) => {
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
})

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started");
});

//https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732a7ad2904bc05f_340.jpg

//https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732a79d19e4dc35f_340.jpg