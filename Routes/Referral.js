const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Model/UserModel");

const router = express.Router();

// Function to generate a referral code
const generateReferralCode = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET);
};

//  API to Generate & Save Referral Code http://localhost:5501/api/referral/generateReferral
router.post("/generateReferral", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.ReferralCode) {
      return res.status(400).json({
        error: "Referral code already generated",
        referralCode: user.ReferralCode,
      });
    }


    // Generate new referral code
    const referralCode = generateReferralCode(email);

    // Save referral code to user in DB
    user.ReferralCode = referralCode;
    await user.save();

    res.status(200).json({
      message: "Referral code generated successfully",
      referralCode,
    });
  } catch (error) {
    console.error("Error generating referral code:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  API to Get Existing Referral Code
//http://localhost:5501/api/referral/getReferral/saurav@example.com
router.get("/getReferral/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if referral code exists
    if (!user.ReferralCode) {
      return res.status(404).json({ error: "Referral code not generated yet" });
    }

    res.status(200).json({ referralCode: user.ReferralCode});
  } catch (error) {
    console.error("Error fetching referral code:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// API to Verify Referral Code
router.get("/verifyReferral/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;

    // Decode JWT Referral Code
    const decoded = jwt.verify(referralCode, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Referral code is valid",
      email: decoded.email, // Extracted email
    });
  } catch (error) {
    console.error("Error verifying referral code:", error.message);
    res.status(400).json({ error: "Invalid or expired referral code" });
  }
});


module.exports = router;