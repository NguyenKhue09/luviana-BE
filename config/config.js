import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();


/**Database connect*/
function connectDB() {
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    mongoose.connect(process.env.DB_URI, mongooseOptions, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Ket noi database thanh cong!");
        }
    })
}

export default  connectDB;
