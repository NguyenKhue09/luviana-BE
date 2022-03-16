import mongoose from "mongoose"
import User from "./user";
import Room from "./room";



const bookingCalendarSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true 
    },
    beginDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: Room,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
})

const BookingCalendar = mongoose.model("BookingCalendar", bookingCalendarSchema);

export default BookingCalendar