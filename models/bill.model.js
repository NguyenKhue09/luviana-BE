import mongoose from "mongoose";
import User from "./user.model.js";
import BookingCalendar from "./bookingCalendar.model.js";
import Apartment from "./apartment.model.js";

const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Owner of bill is required!"],
        ref: User
    },
    apartmentId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Apartment id of bill is required!"],
        ref: Apartment
    },
    totalBookingPeople: {
        type: Number,
        required: [true, "Number totalBookingPeople of bill is required!"],
    },
    userBookingInfos: {
        userName: {
            type: String,
            required: [true, "UserName of userBookingInfos is required!"],
        },
        email: {
            type: String
        },
        phone: {
            type: String,
            required: [true, "Phone of userBookingInfos is required!"],
        }
    },
    note: {
        type: String
    },
    bookingCalendar: [
        {
            type: mongoose.Types.ObjectId,
            ref: BookingCalendar,
            required: [true, "BookingCalendarId of bill is required"]
        }
    ],
    totalCost: {
        type: Number
    }
})


const Bill = mongoose.model("Bill", billSchema);

export default Bill