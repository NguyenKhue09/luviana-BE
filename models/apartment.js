import mongoose from "mongoose"
import Address from "./address.js"



const apartmentSchema = new mongoose.Schema({
    address: {
        type: mongoose.Types.ObjectId(),
        required: true,
        ref: Address
    },
    type: {
        type: String,
        enum: ["motel", "hotel", "homestay", "house", "apartment"]
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    },

})

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment