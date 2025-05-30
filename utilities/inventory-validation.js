const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid integer."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .isInt()
      .withMessage("Classification is required.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      message: null,
      ...req.body
    })
  }

  next()
}

module.exports = validate
