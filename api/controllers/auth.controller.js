import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// ✅ SIGNUP CONTROLLER
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(errorHandler(500, "Signup failed"));
  }
};

// ✅ SIGNIN CONTROLLER
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    next(errorHandler(500, "Signin failed"));
  }
};

// ✅ GOOGLE OAUTH CONTROLLER
export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, user: rest });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    const newUser = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    next(errorHandler(500, "Google sign-in failed"));
  }
};

// ✅ SIGNOUT CONTROLLER
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'User has been logged out!' });
  } catch (error) {
    next(error);
  }
};

