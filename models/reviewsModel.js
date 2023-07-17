import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    products: 
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    
    ratings:{
        type:String
    },
    user: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
