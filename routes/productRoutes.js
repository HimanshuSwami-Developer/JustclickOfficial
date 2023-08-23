import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productBrandController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  orderController,
  CheckoutPayment,
  VerifyPayment,
  productModelController,
  categoryProductListController,
  categoryProductCountController
  // reviewController,
  // getReviews,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//similar product
router.get("/related-product/:pid/bid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//product categorycount
router.get("/product-category/product-count/:slug", categoryProductCountController);

//product category per page
router.get("/product-category/product-list/:slug/:page", categoryProductListController);


// router.get("/product-category/mobile-covers", productCategoryController);

//brand wise product
router.get("/product-brand/:slug", productBrandController);


//post reviews
// router.post("/reviews", reviewController);


//get reviews
// router.get("/get-reviews/:pid/:uid", getReviews);


//payments routes
router.post("/orders", orderController);

//rezor
router.post("/checkout",CheckoutPayment);

//rezor
router.post("/verify",VerifyPayment);

// router.put(
//   "/product-status/:productId",
//   productModelController
// );

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
