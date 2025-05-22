const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

router.get("/classification/:classificationId", invController.buildByClassificationId);

module.exports = router;
