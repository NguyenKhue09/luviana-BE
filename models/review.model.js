import mongoose from "mongoose";
import User from "./user.model.js"

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        require: [true, "Please provide user id!"]
    },
    content: {
        type: String,
    },
    rating: {
        type: Number,
        require: [true, "Please provide rating!"]
    },
    date: {
        type: Date,
        require: [true, "Please provide date!"]
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;