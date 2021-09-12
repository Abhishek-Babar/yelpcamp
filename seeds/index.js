const mongoose = require("mongoose");
const Campground = require("../models/campground")
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCoder = mbxGeocoding({ accessToken: "pk.eyJ1IjoiYWJoaXNoZWtiYWJhciIsImEiOiJja21sbGJhYWYwNzZjMnZsd2ttbGc1ZHB4In0.S50Ax3thv9qgnR2QrtjB3Q"});

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]
const price = Math.floor(Math.random() * 20) + 10;
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 400; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            user: "6051c111de0c441854aa33c1",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city} ,${cities[rand1000].state}`,
            img: [
                {
                    url: "https://res.cloudinary.com/dpky4u8do/image/upload/v1616410552/YelpCamp/qqdcmmvaphjguikeigts.jpg",
                    filename:"YelpCamp/qqdcmmvaphjguikeigts"
                },
                {
                    url: "https://res.cloudinary.com/dpky4u8do/image/upload/v1616324595/YelpCamp/wyxxpobl9djyjy1melac.jpg",
                    filename:"YelpCamp/wyxxpobl9djyjy1melac"
                }
            ],
            geometry: { type: 'Point', coordinates: [cities[rand1000].longitude,cities[rand1000].latitude] },
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora earum dolor veritatis quisquam, vel reiciendis? Possimus voluptatem eligendi non velit autem nam porro! At cumque quisquam, laboriosam corrupti nulla perferendis?",
            price
        })
        await camp.save();
    }
}

seedDB();