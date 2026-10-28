
const express = require("express");

const {
  getDashboardStats,
  createStore,
  updateStore,
   deleteStore,
   deleteUser,
  createUser,
  updateUser,
  getAllUsers,
  getAllStores,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  getDashboardStats
);

// Create a store
router.post(
  "/stores",
  authMiddleware,
  authorizeRoles("admin"),
  createStore
);

// List, search, and sort stores
router.get(
  "/stores",
  authMiddleware,
  authorizeRoles("admin"),
  getAllStores
);

// Update an existing store
router.put(
  "/stores/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateStore
);


// Delete an existing store
router.delete(
  "/stores/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteStore
);

router.delete(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);


// Create a user
router.post(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  createUser
);

// List, search, filter, and sort users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);

// Update an existing user
router.put(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUser
);

module.exports = router;
