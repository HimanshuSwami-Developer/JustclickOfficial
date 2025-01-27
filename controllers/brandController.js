import brandModel from "../models/brandModel.js";
import slugify from "slugify";

// Create a new brand
export const createBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    const existingBrand = await brandModel.findOne({ name });
    if (existingBrand) {
      return res.status(200).send({
        success: false,
        message: "Brand Already Exists",
      });
    }
    const brand = await new brandModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New brand created successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in brand creation",
    });
  }
};

// Update brand
export const updateBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const brand = await brandModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating brand",
    });
  }
};

// Get all brands
export const brandController = async (req, res) => {
  try {
    const brands = await brandModel.find({});
    res.status(200).send({
      success: true,
      message: "All brands list",
      brands,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all brands",
    });
  }
};

// Get a single brand by slug
export const singleBrandController = async (req, res) => {
  try {
    const brand = await brandModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Brand fetched successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single brand",
    });
  }
};

// Delete a brand
export const deleteBrandController = async (req, res) => {
  try {
    const { id } = req.params;
    await brandModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting brand",
      error,
    });
  }
};
