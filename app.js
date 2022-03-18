import express from "express"
import connectDB from "./config/config.js"
import dotenv from "dotenv"
import { UserRouter } from "./routes/user.route.js"


const app = express();

app.use(express.json());
app.use("/user", UserRouter);

connectDB(); 
dotenv.config();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });