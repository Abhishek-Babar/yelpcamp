const express = require("express");
const router = express.Router();
const CatchAsync = require("../utilis/CatchAsync")
const multer = require("multer");

const {storage} = require("../cloudinary");
const upload = multer({ storage });
const Campground = require("../models/campground");

const {isLoggedIn,isValidUser,validateCampground} = require("../middleware");

const campgrounds = require("../controllers/campgrounds");


//routes

router.route("/")
       .get(CatchAsync(campgrounds.index))
       .post(isLoggedIn,upload.array("image"), validateCampground, CatchAsync(campgrounds.newCampground));
       
router.get("/new",isLoggedIn, campgrounds.newForm)

router.route("/:id")
       .get(CatchAsync(campgrounds.showPage))
       .put(isLoggedIn,isValidUser,upload.array("image"), validateCampground, CatchAsync(campgrounds.updateCampground))
       .delete(isLoggedIn,isValidUser, CatchAsync(campgrounds.deleteCampground))

router.get("/:id/edit",isLoggedIn,isValidUser, CatchAsync(campgrounds.editPage))


//end routes

module.exports = router;