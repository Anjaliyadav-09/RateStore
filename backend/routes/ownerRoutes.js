
const express = require("express");

const {
  getOwnerDashboard,
  getStoreRatings,
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// View assigned stores and their average ratings
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("store_owner"),
  getOwnerDashboard
);

// View users who rated a particular store
router.get(
  "/stores/:storeId/ratings",
  authMiddleware,
  authorizeRoles("store_owner"),
  getStoreRatings
);

module.exports = router;
