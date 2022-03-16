import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"


const app = express();

app.use(express.json());

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;

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

app.get('/room', (req, res) => {
  res.send('room page')
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
