import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";

// Centralized secure cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
  sameSite: "Strict",
  maxAge: 7*60*60*24 * 1000, // Max age should be set to the refresh token's expiration time
};

// Utility function to send cookies for login/logout
const sendAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15* 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge:7 * 24 * 60 * 60 * 1000 });
};

// **Create Customer**
export const createCustomer = async (req, res) => {

  const {
    name,
    email,
    contactNumber,
    password,
    companyName,
    iecCode,
  } = req.body;

  try {
    // Validate input data
    if (!name || !email || !contactNumber || !password || !companyName || !iecCode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({ error: "Contact number should be 10 digits" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password should be at least 8 characters" });
    }

    if (!/^[A-Z]{3}\d{7}$/.test(iecCode)) {
      return res.status(400).json({ error: "IEC code should be 3 letters followed by 7 digits" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Create new User
    const newUser = new User({ name, email, contactNumber, password });
    await newUser.save();

    // Create corresponding Customer
    const newCustomer = new Customer({ user: newUser._id, companyName, iecCode });
    await newCustomer.save();

    // Send response
    return res.status(201).json({
      message: "Customer created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
      },
      customer: {
        id: newCustomer._id,
        companyName: newCustomer.companyName,
        iecCode: newCustomer.iecCode,
      },
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};

// **Login User**
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //  console.log(req.body);
  // Validate request data
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    // Verify the password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token to the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send cookies and response
    sendAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// **Logout User**
export const logoutUser = async (req, res) => {
  try {
    // Clear the user's refresh token from the database
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: "" } });

    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// **Refresh Access Token**
export const refreshAccessToken = async (req, res) => {
  try {
    // Get refreshToken from the HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ error: "Refresh token missing" });
    }

    // Verify the refreshToken using JWT
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user by the decoded ID
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Check if the refresh token matches the one in the user's record
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = user.generateAccessToken();

    // Send the new access token as a cookie
    res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15*60 * 1000 });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
