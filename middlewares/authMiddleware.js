import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token based middleware
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authorization token is required",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Admin Access Middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access, Admins only",
      });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).send({
      success: false,
      message: "Server Error in admin middleware",
      error,
    });
  }
};
