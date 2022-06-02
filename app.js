import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"
import cors from 'cors';

import { UserRouter } from "./routes/user.route.js"
import { ApartmentRouter } from "./routes/apartment.route.js"
import { BlogRouter } from "./routes/blog.route.js"
import { BillRouter } from "./routes/bill.route.js"
import { BookingCalendarRouter } from "./routes/booking_calendar.route.js"
import { AdminRouter } from "./routes/admin.route.js";
import { RevenueRouter } from "./routes/revenue.route.js";

const app = express();

// Lib 
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import csurf from 'csurf'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from "express-rate-limit"
import favicon  from 'serve-favicon'
import path from 'path'
import RoomRouter from "./routes/room.router.js"
import Bill from "./models/bill.model.js"

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;

// Apply library
// app.use(favicon(path.join(__dirname, 'public','logoIcon.ico'))); // favicon
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(cookieParser(process.env.SECRET_COOKIES));

// app.use(csurf({ cookie: true }));
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: parseInt(process.env.SESSION_TIMEOUT) || 60000000 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
);

app.use("/admin", AdminRouter);
app.use("/user", UserRouter);
app.use("/apartment", ApartmentRouter);
app.use("/room", RoomRouter)
app.use("/blog", BlogRouter);
app.use("/bill", BillRouter)
app.use("/booking-calendar", BookingCalendarRouter)
app.use("/revenue", RevenueRouter)



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
