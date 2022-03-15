import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"


const app = express();

app.use(express.json());

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });