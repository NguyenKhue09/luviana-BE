import mongoose from "mongoose"


const addressSchema = new mongoose.Schema({
    apartmentNumber: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    }, 
    country: {
        type: String,
        required: true
    }
})

const Address = mongoose.model("Address", addressSchema);

export default Address