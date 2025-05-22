const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

router.get(
  "/classification/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
);

router.get("/trigger-error", (req, res, next) => {
  throw new Error("This is a simulated 500 error");
});

module.exports = router;
