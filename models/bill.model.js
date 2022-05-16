import mongoose from "mongoose";
import User from "./user.model";
import BookingCalendar from "./bookingCalendar.model";

const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Owner of bill is required!"],
        ref: User
    },
    totalBookingPeople: {
        type: Number,
        required: [true, "Number totalBookingPeople of bill is required!"],
    },
    userBookingInfos: {
        userName: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        }
    },
    note: {
        type: String
    },
    bookingCalendar: [
        {
            type: mongoose.Types.ObjectId,
            ref: BookingCalendar
        }
    ],
    totalCost: {
        type: Number
    }
})


const Bill = mongoose.model("Bill", billSchema);

export default Bill