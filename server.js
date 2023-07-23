import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
// import {Configuration, OpenAIApi} from "openai";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import Razorpay from "razorpay";
import bodyParser from "body-parser";


import path from "path";
import {fileURLToPath} from 'url';


//configure env
dotenv.config();


//payment razor gateway
export const gatewayInstance = new Razorpay({
  key_id: process.env.ID_KEY,
  key_secret: process.env.SECRET_KEY
})

export const secret_key=process.env.SECRET_KEY;

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("dev"));


// 👇️ "/home/borislav/Desktop/javascript/index.js"
const __filename = fileURLToPath(import.meta.url);
console.log(__filename)

// 👇️ "/home/borislav/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

app.use(express.static(path.join(__dirname,"/client","build")))



//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/product", productRoutes);
app.get("/api/getkey",(req,res)=>{
  res.status(200).json({key:process.env.ID_KEY})
});
app.get("/api/getURL",(req,res)=>{
  res.status(200).json({key:process.env.REDIRECT_URL})
});



//rest api
app.get("*", (req, res) => {
  res.send("<div style='height:90vh; display:flex; flex-direction:column; justify-content:center;'><center><h1>Order Successful</h1><h2>Move to Orders Section  👇️ </h2><h3><a href='https://sore-pear-badger-cape.cyclic.app/dashboard/user/orders' style='text-decoration:none'>Please Click Here</a></h3></center></div>");
    //  req.send(order.html);
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});
