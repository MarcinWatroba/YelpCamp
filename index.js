const express = require("express");
const app = express();
const request = require("request-promise");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let campgrounds = [
    {name: "Camp North", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732a7ad2904bc05f_340.jpg"},
    {name: "Camp South", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732a7ad2904bc05f_340.jpg"},
    {name: "Camp West", image: "https://pixabay.com/get/52e3d4464e55ae14f6da8c7dda793f7f1636dfe2564c704c732a7add944cc051_340.jpg"},
    {name: "Camp East", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732a7ad2904bc05f_340.jpg"},
];

app.post("/campgrounds", (req, res) => {
    const name = req.body.camp;
    const image = req.body.img;
    campgrounds.push({name, image});
    
    res.redirect("campgrounds");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {camps: campgrounds});
});



app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});



var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started");
});