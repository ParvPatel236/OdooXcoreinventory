const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");

const router = express.Router();

router.get("/", getWarehouses);
router.post("/", authMiddleware, createWarehouse);
router.put("/:id", authMiddleware, updateWarehouse);
router.delete("/:id", authMiddleware, deleteWarehouse);

module.exports = router;
