import mongoose from "mongoose"
import User from "./user";
import Room from "./room";



const bookingCalendarSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: [true, "Customer id of booking calendar is required!"]
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: [true, "Owner of booking calendar is required!"] 
    },
    beginDate: {
        type: Date,
        required: [true, "Begin date of booking calendar is required!"]
    },
    endDate: {
        type: Date,
        required: [true, "End date of booking calendar is required!"]
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: Room,
        required: [true, "Id room of booking calendar is required!"]
    },
    cost: {
        type: Number,
        required: [true, "Cost of booking calendar is required! "]
    }
})

const BookingCalendar = mongoose.model("BookingCalendar", bookingCalendarSchema);

export default BookingCalendar