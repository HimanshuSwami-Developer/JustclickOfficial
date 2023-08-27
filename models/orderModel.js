import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
       
      },
       
    ],
   
    size:
   [ {
      // required:true,
    Default:"M",
  type: String,
  },],
    
  model:
    [{
    // required:true,
    Default:"Sumsung Galaxy",
    type: String,
    },],
  
    orders:[{
    }],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    buyerName: {
      type: String,
    },
    
    total:{
      type:String,
    },

    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
