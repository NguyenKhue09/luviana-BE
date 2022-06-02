import { BookingCalendarController } from "../controllers/booking_calendar.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import express from "express";


const BookingCalendarRouter = express.Router()

BookingCalendarRouter.get("/", BookingCalendarController.getBookingCalendar)
BookingCalendarRouter.get("/get-calandar-user", AuthMiddleWare.requireUser ,BookingCalendarController.getBookingCalendarOfUser)

export { BookingCalendarRouter };