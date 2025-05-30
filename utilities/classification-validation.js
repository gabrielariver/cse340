const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* ****************************************
 *  Validation rules for adding classification
 * *************************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification must not contain spaces or special characters."),
  ]
}

/* **********************************
 *  Check classification data and return errors
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array()
    })
    return
  }
  next()
}

module.exports = validate
