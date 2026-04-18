import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authMiddleware;