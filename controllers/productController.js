import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import  {gatewayInstance, secret_key}  from "./../server.js";
import braintree from "braintree";
import dotenv from "dotenv";
import brandModel from "../models/brandModel.js";
import reviewsModel from "../models/reviewsModel.js";
/* import checksum generation utility */
import crypto from "crypto";
import  {Payment}  from "./../models/paymentModel.js";
// import PaytmChecksum from "./PaytmChecksum";


dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



export const createProductController = async (req, res) => {
  try {
    const { name, description, price, userquantity,category,brand, quantity,importantDescription,extraDescription,shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !userquantity:
        return res.status(500).send({ error: "userquantity is Required" });  
      case !category:
        return res.status(500).send({ error: "Category is Required" });         
      case !brand:
        return res.status(500).send({ error: "brand is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });// .limit(12)
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price,userquantity, category,brand,quantity,importantDescription,extraDescription,  shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !userquantity:
        return res.status(500).send({ error: "userquantity is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !brand:
        return res.status(500).send({ error: "Brand is Required" });  
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    // if(checked.length > 0) args.brand = checked; 
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category"); 
    res.status(200).send({
      success: true,
      products,
    });
    // console.log(populate("brand"));
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};



// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    var categorySlug = req.params.slug;
    const category = await categoryModel.findOne({ categorySlug },function(err){
      if(err){
          console.log(err);
      } });
    // const products = await productModel.find({ category })
    // .populate("category")
    // .select("-photo")
    // .limit(12)
    // .sort({createdAt:-1});
    res.status(200).send({
      success: true,
      total:products.length,
      message: "ALlProducts ",
      category,
      // products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error While Getting products",
    });
  }
};


// filters
export const categoryProductFiltersController = async (req, res) => {
  try {
    const { radio } = req.body;
    let args = {};
    // if (checked.length > 0) args.category = checked;
    // if(checked.length > 0) args.brand = checked; 
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};


// product count category
export const categoryProductCountController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const total = await productModel.findOne({ category }).countDocuments();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page by category
export const categoryProductListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const category = await categoryModel.findOne({ slug: req.params.slug });
    // const products = await productModel.find({ category }).populate("category");
    const products = await productModel
      .find({ category })
      .populate("category")
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};



// get prdocyst by brand
export const productBrandController = async (req, res) => {
  try {
    const brand = await brandModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ brand }).populate("brand");
    res.status(200).send({
      success: true,
      brand,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};



//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
             
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};



//razor payment

export const CheckoutPayment = async (req, res) => {
  try{
    const { cart,user } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    console.log(total);
    const options = {
        amount: Number(total * 100),
        currency:'INR',
        receipt:"order-12",
        }

  

    const orders = await gatewayInstance.orders.create(options)

    
    res.status(200).json({success:true,orders});
    
     
  } catch (error) {
    console.log(error);
  }
};


export const VerifyPayment= async (req,res)=>{

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto.createHmac("sha256", secret_key).update(body.toString()).digest("hex");


  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    console.log("verify");

    // const check=CheckoutPayment(cart,user);
    
    // console.log(check)
    
    res.redirect(
      `${process.env.REDIRECT_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
    

  } else {
    res.status(400).json({
      success: false,
    });
  
}
 
}



//payment order
export const orderController = async (req, res) => {
  try {
    const { cart,user,size,model } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    console.log(cart);
    if (true) {
      console.log(total);
      const order = new orderModel({
        // productName:cart.name,
        total:total,
        products: cart,
        model:model,
        size:size,
        payment: true,
        buyer: user._id,
      }).save();
      res.json({ ok: true });

      console.log(order);
    } 

  } catch (error) {
    console.log(error);
  }
};



export const productModelController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { model } = req.body;
    const product = await productModel.findByIdAndUpdate(
      productId,
      model ,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing products",
      error,
    });
  }
};


//reviews
// export const reviewController = async (req, res) => {
//   try {
//     const { product,user,reviews,ratings } = req.body;
//     // let total = 0;
//     // cart.map((i) => {
//     //   total += i.price;
//     // });
    
//     if (true) {
//       const review = new reviewsModel({
//         product: product._id,
//         review:reviews,
//         ratings:ratings,
//         user: user._id,
//       }).save();
//       res.json({ ok: true });
//     } 
//   } catch (error) {
//     console.log(error);
//   }
// };

//get all products
// export const getReviews = async (req, res) => {
//   try {
//     const Reviews = await reviewsModel
//       .find({})
//       .populate("ratings")
//       .limit(12)
//       .sort({ createdAt: -1 });
//     res.status(200).send({
//       success: true,
//       counTotal: Reviews.length,
//       message: "All Reviews ",
//       Reviews,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Erorr in getting products",
//       error: error.message,
//     });
//   }
// };






//payment gateway api
//token
// export const paytmTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


//payment
// export const PaytmPaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
              
//               var paytmParams = {};

//               /* initialize an array */
//               paytmParams["MID"] = "YOUR_MID_HERE";
//               paytmParams["ORDERID"] = "YOUR_ORDER_ID_HERE";
              
//               /**
//               * Generate checksum by parameters we have
//               * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
//               */
//               var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, "YOUR_MERCHANT_KEY");
//               paytmChecksum.then(function(checksum){
//                 console.log("generateSignature Returns: " + checksum);
//               }).catch(function(error){
//                 console.log(error);
//               });
//       // then(error, result){
//       //   if (result) {
//       //     const order = new orderModel({
//       //       products: cart,
//       //       payment: result,
//       //       buyer: req.user._id,
//       //     }).save();
//       //     res.json({ ok: true });
//       //   } else {
//       //     res.status(500).send(error);
//       //   }
//       // }
//   } catch (error) {
//     console.log(error);
//   }
// };
