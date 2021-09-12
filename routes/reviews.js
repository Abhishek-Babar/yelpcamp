const express = require("express");
const router = express.Router({ mergeParams: true });
const CatchAsync = require("../utilis/CatchAsync")
const Review = require("../models/review");
const Campground = require("../models/campground");

const {isLoggedIn,validateReview, isReviewUser} = require("../middleware");
const reviews = require("../controllers/reviews");



router.post("/",isLoggedIn, validateReview, CatchAsync(reviews.addReview))
router.delete("/:reviewID",isLoggedIn,isReviewUser, CatchAsync(reviews.deleteReview))

module.exports = router;