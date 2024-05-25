import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER*/
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body; //destructing these from req.body || taking from frontend

    const salt = await bcrypt.genSalt(); //generate random salt for encryption
    const passwordHash = await bcrypt.hash(password, salt); //hashed password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save(); //saves the user
    res.status(201).json(savedUser); //sends the success status
  } catch (err) {
    res.status(500).json({ error: err.message }); //send the error status
  }
};

// /* Login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //find the one which has the specific email
    if (!user) return res.status(400).json({ msg: " User Not Found... " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials.." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; //the pass shouldn't get sent to frontend
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message }); //send the error status
  }
};
