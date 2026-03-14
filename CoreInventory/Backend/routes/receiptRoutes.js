const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getReceipts,
  createReceipt,
  getReceiptDetails,
} = require("../controllers/receiptController");

const router = express.Router();

router.get("/", getReceipts);
router.get("/:id", getReceiptDetails);
router.post("/", authMiddleware, createReceipt);

module.exports = router;
