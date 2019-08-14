const mongoose   = require("mongoose"),
      Comment    = require("../models/comment");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

campgroundSchema.pre('remove', { query: true, document: false }, (next) => {
    console.log("removing");
    // Comment.remove({author: {id: this.author.id}}).exec();
    next();
});

module.exports = mongoose.model("Campground", campgroundSchema);
