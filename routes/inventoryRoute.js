const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidation = require("../utilities/inventory-validation")


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

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.classificationRules(),  
  utilities.checkClassificationData, 
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;
