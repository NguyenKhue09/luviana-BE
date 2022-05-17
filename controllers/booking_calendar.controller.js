import { BookingCalendarServices } from "../services/bookingCalendar.services.js";

async function getBookingCalendar(req, res) {
    const {beginDate, endDate} = req.body
    try {
        var result = await BookingCalendarServices.getBookingCalendar(beginDate, endDate);

        if (result.success) {
            if (result.data) return res.json(result)
            else return res.status(404).json(result)
        } else {
            return res.status(400).json(result)
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
            data: null
        })
    }
}

export const BookingCalendarController = {
    getBookingCalendar
}