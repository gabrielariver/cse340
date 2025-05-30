const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  let className = "Vehicles"
  if (data.length > 0) {
    className = data[0].classification_name
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view by inventory ID
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(invId)
    const nav = await utilities.getNav()
    const vehicleDetail = utilities.buildVehicleDetail(data[0])

    res.render("./inventory/detail", {
      title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      vehicleDetail
    })
  } catch (error) {
    next(error)
  }
}

async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
  })
}
/* ****************************************
 *  Deliver add classification view
 * *************************************** */
async function buildAddClassification(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: null,
    errors: null
  })
}

/* ****************************************
 *  Process add classification form
 * *************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: null
    })
  }
}

/* ****************************************
 *  Deliver add inventory view
 * *************************************** */
async function buildAddInventory(req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    message: null
  })
}

/* ****************************************
 *  Process inventory form
 * *************************************** */
async function addInventory(req, res) {
  console.log("REQ.BODY:", req.body)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: null,
      errors: null,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    })
  }
}

module.exports = {
  buildByClassificationId: invCont.buildByClassificationId,
  buildByInventoryId: invCont.buildByInventoryId,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
}
