import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"
import { UserRouter } from "./routes/user.route.js"
import { ApartmentRouter } from "./routes/apartment.route.js"


const app = express();

app.use(express.json());
app.use("/user", UserRouter);
app.use("/apartment", ApartmentRouter);

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });