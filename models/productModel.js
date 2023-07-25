import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userquantity: {
      type: Number,
      required: true,
    },
    importantDescription: {
      type: String,
      },
      
    extraDescription: {
      type: String,
      },
    
      size:{
        default:"M",
      type: String,
      },
    
      model:{
        Default:"Sumsung Galaxy",
        type: String,
        },

    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.ObjectId,
      ref: "Brand",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
