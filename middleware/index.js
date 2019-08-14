//All the middleware
let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.isAuthorized = function(model, id) {
    return (req, res, next) => {
        model.findById(req.params[id])
        .then(result => {
        if(result.author.id.equals(req.user._id))
            return next();
        else
            return res.redirect("back");
        })
        .catch(err => res.redirect("back"));
    }
}

middlewareObj.isLoggednAuthorized = function(model, id) { 
    return [middlewareObj.isLoggedIn, middlewareObj.isAuthorized(model, id)];
}


module.exports = middlewareObj;


