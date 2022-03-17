import mongoose from "mongoose"



const vouchertSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Code of voucher is required!"]
    },
    discount: {
        type: Number,
        required: [true, "Discount of voucher is required!"]
    },
    type: {
        type: String,
        required: [true, "Type of voucher is required!"]
    },
    beginDate: {
        type: Date,
        required: [true, "Begin date of voucher is required!"]
    },
    endDate: {
        type: Date,
        required: [true, "End date of voucher is required!"]
    }
})

const Voucher = mongoose.model("Voucher", vouchertSchema);

export default Voucher