import mongoose from "mongoose"
import Apartment from "./apartment.model.js";



const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Room name is required!"]
    },
    apartmentId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Apartment id of room is required!"],
        ref: Apartment
    },
    price: {
        type: Number,
        required: [true, "Price of room is required!"]
    },
    bedName: {
        type: String,
        required: [true, "Beb name of room is required!"]
    },
    capacity: {
        type: String,
        required: [true, "Capacity of room is required!"]
    },
    square: {
        type: String,
        required: [true, "Room square is required!"]
    },
    rating: {
        type: Number,
        required: [true, "Rating of room is required!"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail of room is required!"]
    },
    pictures: [{
        type: String,
    }],
    isAvailable: {
        type: Boolean,
        default: true,
        required: true
    },
    facilities: [{
        type: String,
        required: [true, "Facilities of room is required!"]
    }]
})

const Room = mongoose.model("Room", roomSchema);

export default Room