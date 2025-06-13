const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");

// Add review route (POST)
router.post("/add", utilities.checkLogin, reviewController.addReview);

module.exports = router;
