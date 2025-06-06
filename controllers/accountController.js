const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice")
  })
}
/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice"),
    errors: null
  })
}
/* ****************************************
*  Process Registration and Team Activity w04
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      message: null,
      errors: null
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      message: req.flash("notice"),
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      message: req.flash("notice")
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Build account management view 
* *************************************** */
async function buildManagement(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;

  res.render("account/management", {
  title: "Account Management",
  nav,
  accountData,
  message: req.flash("notice"), 
  errors: null
});

}

/* ****************************************
 *  Deliver update view
 * *************************************** */
async function buildUpdate(req, res) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    message: null,
    errors: null,
  });
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.account_password;

      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600 * 1000
      });

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000
      });

      req.flash("notice", "Account updated successfully.");
      return res.render("account/management", {
        title: "Account Management",
        nav,
        accountData: updatedAccount,
        message: req.flash("notice"),
        errors: null
      });
    } else {
      req.flash("notice", "Account update failed.");
      return res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("notice", "Something went wrong during account update.");
    return res.redirect(`/account/update/${account_id}`);
  }
}

/* ****************************************
 *  Process password update
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      req.flash("notice", "Password changed successfully.");
      res.render("account/management", {
        title: "Account Management",
        nav,
        accountData,
        message: req.flash("notice"),
        errors: null
      });
    } else {
      req.flash("notice", "Password update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect(`/account/update/${account_id}`);
  }
}

function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdate,
  updateAccount,
  updatePassword,
  logout
};
