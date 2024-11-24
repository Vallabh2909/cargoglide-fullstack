import jwt from "jsonwebtoken";
import  User from "../models/user.model.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

export const verifyJWT = async (req, res, next) => {
  // console.log(req.cookies);
  try {
    // Get the token from cookies or the Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized Request" });
    }

    try {
      // Verify the access token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid Access Token" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Handle token expiration by calling refreshAccessToken function
        return refreshAccessToken(req, res); // Call refreshAccessToken function
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid Access Token" });
      }
    }
  } catch (error) {
    return res.status(401).json({ error: error?.message || "Invalid Access Token" });
  }
};