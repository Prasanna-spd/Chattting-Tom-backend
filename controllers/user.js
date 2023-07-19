const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../features/generateToken");

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      resizeBy.status(400);
      throw new Error("Please Enter All Fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "Registered Successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Failed to Create Credentials",
      });
      throw new Error("Failed to Create Credentials");
    }
  } catch (error) {
    // res.status(401).json({
    //   message: error.message,
    // });
    console.error("An error occurred:", error.message);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      res.status(200).json({
        success: true,
        message: `Welcome Back ${user.name}`,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    // res.status(401).json({
    //   message: "User does not exist",
    // });
    console.error("An error occurred:", error.message);
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { register, login, allUsers };
