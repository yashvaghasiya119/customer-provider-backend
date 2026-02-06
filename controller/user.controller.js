import {userModel} from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      city,
      state,
      country,
      role,
      providerType,
      lattitude,
      longitude,
    } = req.body;

    // 1️⃣ Basic validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email or username",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      city,
      state,
      country,
      role,
      providerType,
      lattitude,
      longitude,
    });

    // 5️⃣ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const allUser = async (req, res) => {
  try {
    // Fetch users without passwords
    const users = await userModel.find().select("-password");

    

    // Return the response
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1️⃣ Validate input
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }
  
      // 2️⃣ Check if user exists
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      // 3️⃣ Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      // 4️⃣ Create JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role, 
        },
        "yash",
        {
          expiresIn: "7d",
        }
      );
      console.log("🚀 ~ login ~ token:", token)
  
      // 5️⃣ Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
  

    res.setHeader("authorization", `${token}`);

    res.status(200)
    .json({
      message: "Login successful",
      user: userResponse,
    });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error",
      });
    }
  };