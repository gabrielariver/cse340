const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidation = require("../utilities/inventory-validation");
const { checkEmployeeOrAdmin } = require("../utilities/account-check");

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
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.classificationRules(),  
  utilities.checkClassificationData, 
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  checkEmployeeOrAdmin,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);


router.get("/edit/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  checkEmployeeOrAdmin,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteView)
);

router.post(
  "/delete",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
