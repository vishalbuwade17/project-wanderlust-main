const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now // Use Date.now without parentheses
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User" // Ensure this matches the model name exactly
    }
});

module.exports = mongoose.model("Review", reviewSchema);
