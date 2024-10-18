import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  brandController,
  createBrandController,
  deleteBrandController,
  singleBrandController,
  updateBrandController,
} from "./../controllers/brandController.js";

const router = express.Router();

//routes
// create brand
router.post(
  "/create-brand",
  requireSignIn,
  isAdmin,
  createBrandController
);

//update brand
router.put(
  "/update-brand/:id",
  requireSignIn,
  isAdmin,
  updateBrandController
);

//getALl brand
router.get("/get-brand", brandController);

//single brand
router.get("/single-brand/:slug", singleBrandController);

//delete brand
router.delete(
  "/delete-brand/:id",
  requireSignIn,
  isAdmin,
  deleteBrandController
);

export default router;
