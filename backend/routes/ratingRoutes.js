
const express = require("express");

const {
  submitRating,
  getAllRatings,
} = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Only normal users can submit or update ratings
router.post(
  "/",
  authMiddleware,
  authorizeRoles("user"),
  submitRating
);

// Only admins can view all ratings
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllRatings
);

module.exports = router;
