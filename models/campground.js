const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");
const opts = {toJSON:{virtuals:true}};
const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    img: [ImageSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},opts);
CampgroundSchema.virtual("properties.popUpText").get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>          
    `
})

CampgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
    if (campground.img.length) {
        for (let image of campground.img) {
            cloudinary.uploader.destroy(image.filename);
        }
    }
})
module.exports = mongoose.model("Campground", CampgroundSchema);