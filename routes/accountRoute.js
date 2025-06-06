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
// GET update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
);

// POST update account info
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// POST update password
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);
router.get("/logout", accountController.logout);

module.exports = router
