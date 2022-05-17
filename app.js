import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"
import { UserRouter } from "./routes/user.route.js"
import { ApartmentRouter } from "./routes/apartment.route.js"
import { BlogRouter } from "./routes/blog.route.js"
import { BillRouter } from "./routes/bill.route.js"

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
import upload from './middlewares/upload.middleware.js'
import RoomRouter from "./routes/room.router.js"
import Bill from "./models/bill.model.js"

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;

// Apply library
// app.use(favicon(path.join(__dirname, 'public','logoIcon.ico'))); // favicon
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

app.use("/user", UserRouter);
app.use("/apartment", ApartmentRouter);
app.use("/room", RoomRouter)
app.use("/blog", BlogRouter);
app.use("/bill", BillRouter)

// Delete later

app.get('/home', (req, res) => {
  res.send('home page')
})

app.get('/login', (req, res) => {
  res.send('login page')
})

app.get('/sign-up', (req, res) => {
  res.send('sign up page')
})

app.get('/search', (req, res) => {
  res.send('search page')
})

app.get('/hotel', (req, res) => {
  res.send('hotel page')
})

app.get('/hotel/detail/:id', (req, res) => {
  res.send('hotel detail page')
})

app.get('/motel', (req, res) => {
  res.send('sign up page')
})

app.get('/motel/detail/:id', (req, res) => {
  res.send('motel detail page')
})

app.get('/house', (req, res) => {
  res.send('house page')
})

app.get('/house/detail/:id', (req, res) => {
  res.send('house detail page')
})

app.get('/resort', (req, res) => {
  res.send('resort page')
})

app.get('/resort/detail/:id', (req, res) => {
  res.send('resort detail page')
})

app.get('/room/detail/:id', (req, res) => {
  res.send('room detail page')
})


app.get('/profile', (req, res) => {
  res.send('profile page')
})

app.get('/payment', (req, res) => {
  res.send('payment page')
})

app.get('/favourites', (req, res) => {
  res.send('favourite page')
})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
