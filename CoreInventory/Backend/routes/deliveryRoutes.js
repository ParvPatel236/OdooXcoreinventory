const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDeliveries,
  createDelivery,
  getDeliveryDetails,
} = require("../controllers/deliveryController");

const router = express.Router();

router.get("/", getDeliveries);
router.get("/:id", getDeliveryDetails);
router.post("/", authMiddleware, createDelivery);

module.exports = router;
