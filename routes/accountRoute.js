const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

// GET route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// GET route to display registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration 
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

module.exports = router
