const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserModel");

const router = express.Router();

// Create User (Register)
router.post("/createUser", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    await user.save();

    // Return user data (without password)
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
