
const express = require("express");

const { getStores } = require("../controllers/storeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get and search stores, including average and personal ratings
router.get("/", authMiddleware, getStores);

module.exports = router;
