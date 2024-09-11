const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Use environment variable for MongoDB URL (recommended)
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://vishalbuwade17:Vishal17@cluster0.ej7lx.mongodb.net/?retryWrites=true&w=majority";

async function main() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
    await initDB();
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    mongoose.connection.close();
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    // Ensure the owner field is a valid ObjectId
    const ownerId = "6531350a2543406980779aae";
    initData.data = initData.data.map((obj) => ({ ...obj, owner: ownerId }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

main();
