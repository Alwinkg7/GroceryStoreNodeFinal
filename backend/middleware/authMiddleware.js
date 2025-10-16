import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // using 'sub' from token

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found" });
    }

    // Attach user info to req.user
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next(); // continue to the route
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
