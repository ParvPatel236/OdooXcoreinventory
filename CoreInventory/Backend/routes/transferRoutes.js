const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTransfers,
  createTransfer,
} = require("../controllers/transferController");

const router = express.Router();

router.get("/", getTransfers);
router.post("/", authMiddleware, createTransfer);

module.exports = router;
