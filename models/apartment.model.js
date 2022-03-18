import mongoose from "mongoose"
import Address from "./address.model.js"



const apartmentSchema = new mongoose.Schema({
    address: {
        type: mongoose.Types.ObjectId(),
        required: [true, "Address of appartment is required!"],
        ref: Address
    },
    type: {
        type: String,
        required: [true, "Type of appartment is required!"],
        enum: ["motel", "hotel", "homestay", "house", "apartment", "resort"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: [true, "Description of appartment is required!"]
    }

})

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment
