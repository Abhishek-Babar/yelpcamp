const Campground = require("./models/campground");
const { campgroundSchema,reviewSchema } = require("./schemas");
const Review = require("./models/review");
const AppError = require("./utilis/AppError");
module.exports.isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","You must be singed in first!");
        req.session.returnTo = req.originalUrl;
        res.redirect("/user/login");
    } else {
        next();
    }
}
module.exports.isValidUser = async(req,res,next) => {
    const campground = await Campground.findById(req.params.id).populate("user","_id");
    if(!campground.user.equals(req.user._id)){
        req.flash("error","You are not authorized User");
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
}
module.exports.isReviewUser = async(req,res,next) => {
    const review = await Review.findById(req.params.reviewID).populate("user","_id");
    if(!review.user.equals(req.user._id)){
        req.flash("error","You are not authorized User");
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(msg, 400);

    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(msg, 400)
    } else {
        next();
    }
}