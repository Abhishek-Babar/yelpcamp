const Review = require("../models/review");
const Campground = require("../models/campground");
module.exports.addReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.user = req.user._id;
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds/${id}`);
}