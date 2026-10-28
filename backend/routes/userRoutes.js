
const express = require("express");

const {
  getProfile,
  updatePassword,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get the logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

// Update the logged-in user's password
router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;
