const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBarcodes,
  createBarcode,
  getBarcodeByValue,
  deleteBarcode,
} = require("../controllers/barcodeController");

const router = express.Router();

router.get("/", getBarcodes);
router.get("/value/:barcode_value", getBarcodeByValue);
router.post("/", authMiddleware, createBarcode);
router.delete("/:id", authMiddleware, deleteBarcode);

module.exports = router;
