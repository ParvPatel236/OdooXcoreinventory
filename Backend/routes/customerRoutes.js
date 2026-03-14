const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.post("/", authMiddleware, createCustomer);
router.put("/:id", authMiddleware, updateCustomer);
router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;
