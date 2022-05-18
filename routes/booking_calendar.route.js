import { BookingCalendarController } from "../controllers/booking_calendar.controller.js";
import express from "express";

const BookingCalendarRouter = express.Router()

BookingCalendarRouter.get("/", BookingCalendarController.getBookingCalendar)

export { BookingCalendarRouter };