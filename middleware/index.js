//All the middleware
let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isAuthorized = function(model, id) {
    return (req, res, next) => {
        model.findById(req.params[id])
        .then(result => {
        if(result.author.id.equals(req.user._id))
            return next();
        else
            req.flash("error", "You don't have permissions to do that");
            return res.redirect("back");
        })
        .catch(err => {
            req.flash("error", "Something went wrong");
            return res.redirect("back");
        });
    }
}

middlewareObj.isLoggednAuthorized = function(model, id) { 
    return [middlewareObj.isLoggedIn, middlewareObj.isAuthorized(model, id)];
}


module.exports = middlewareObj;


