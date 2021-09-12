const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}
module.exports.newForm = (req, res) => {
    res.render("campgrounds/new");
}
module.exports.newCampground = async (req, res) => {
    const geoCode = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.user = req.user._id;
    campground.geometry = geoCode.body.features[0].geometry;
    await campground.save();
    console.log(campground)
    req.flash("success", "Successfully created new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.showPage = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "user"
        }
    }).populate("user");
    if (!campground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}
module.exports.editPage = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}
module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const files = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if (req.body.deleteImages) {
    req.body.deleteImages.forEach(async (image) => {
        await campground.update({ $pull: { img: { filename: image } } });
        cloudinary.uploader.destroy(image);
    })
}
    campground.img.push(...files);
    await campground.save();
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}