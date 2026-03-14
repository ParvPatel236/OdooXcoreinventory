const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const router = express.Router();

router.get("/", getSuppliers);
router.post("/", authMiddleware, createSupplier);
router.put("/:id", authMiddleware, updateSupplier);
router.delete("/:id", authMiddleware, deleteSupplier);

module.exports = router;
