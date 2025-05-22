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
  const className = data[0].classification_name
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


module.exports = invCont
