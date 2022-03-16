import mongoose from "mongoose"
import { required } from "nodemon/lib/config";
import Apartment from "./apartment";



const roomSchema = new mongoose.Schema({
    apartmentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: Apartment
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    pictures: [{
        type: String,
        required: true
    }],
    isAvailable: {
        type: Boolean,
        default: true,
        required: true
    },
    facilities: [{
        type: String,
        required: true
    }]
})

const Room = mongoose.model("Room", roomSchema);

export default Room