const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getStockSummary,
  getMovementStats,
  getWarehouseUtilization,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/stock-summary", authMiddleware, getStockSummary);
router.get("/movement-stats", authMiddleware, getMovementStats);
router.get("/warehouse-utilization", authMiddleware, getWarehouseUtilization);

module.exports = router;
