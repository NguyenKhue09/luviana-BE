import mongoose from "mongoose"


const addressSchema = new mongoose.Schema({
    apartmentNumber: {
        type: String,
        required: [true, "Apartment number is required!"]
    },
    street: {
        type: String,
        required: [true, "Street is required!"]
    },
    district: {
        type: String,
        required: [true, "District is required!"]
    },
    province: {
        type: String,
        required: [true, "Province is required!"]
    }, 
    country: {
        type: String,
        required: [true, "Country is required"]
    }
})

const Address = mongoose.model("Address", addressSchema);

export default Address