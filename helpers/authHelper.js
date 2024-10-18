import bcrypt from "bcrypt";

// Function to hash a password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

// Function to compare a password with a hashed password
export const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // Returns true if matched, false otherwise
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Password comparison failed");
  }
};
