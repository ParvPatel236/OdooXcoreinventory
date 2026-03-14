const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStockLevels,
  getStockByProduct,
  updateStockLevel,
  getLowStockProducts,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/", getStockLevels);
router.get("/product/:productId", getStockByProduct);
router.get("/low-stock", getLowStockProducts);
router.put("/:productId/:warehouseId", authMiddleware, updateStockLevel);

module.exports = router;
