const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMovements,
  createMovement,
  getMovementHistory,
} = require("../controllers/movementController");

const router = express.Router();

router.get("/", getMovements);
router.get("/history", getMovementHistory);
router.post("/", authMiddleware, createMovement);

module.exports = router;
