const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAdjustments,
  createAdjustment,
} = require("../controllers/adjustmentController");

const router = express.Router();

router.get("/", getAdjustments);
router.post("/", authMiddleware, createAdjustment);

module.exports = router;
