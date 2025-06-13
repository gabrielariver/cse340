const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reviewModel = require("../models/review_model");

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
    const reviews = await reviewModel.getReviewsByInvId(invId)
    const nav = await utilities.getNav()
    const vehicleDetail = utilities.buildVehicleDetail(data[0])

    res.render("./inventory/detail", {
      title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      vehicleDetail,
      reviews,      
      inv_id: invId, 
      accountData: res.locals.accountData
    })
  } catch (error) {
    next(error)
  }
}

async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    message: req.flash("notice"),
    errors: null
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
  let classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
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
  let classificationSelect = await utilities.buildClassificationList()
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
      classificationSelect,
      message: null,
      errors: null,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    })
  }
}
/* ****************************************
 *  Process Update Inventory
 * *************************************** */
async function updateInventory(req, res) {
  let nav = await utilities.getNav();
  const {
    inv_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  );

  if (updateResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classificationList,
      errors: null,
      inv_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    });
  }
}

async function getInventoryJSON(req, res) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    return res.json([])
  }
}

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)

  res.render("inventory/edit-inventory", {
    title: `Edit ${itemData[0].inv_make} ${itemData[0].inv_model}`,
    nav,
    classificationSelect,
    errors: null,
    message: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

//w05 Team activity
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemData[0].inv_make + " " + itemData[0].inv_model,
    nav,
    classificationSelect,
    errors: null,
    message: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

async function deleteInventory(req, res) {
  const inv_id = parseInt(req.body.inv_id)
  const result = await invModel.deleteInventory(inv_id)
  let nav = await utilities.getNav()

  if (result) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete Confirmation",
      nav,
      message: null
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
  addInventory,
  getInventoryJSON,
  updateInventory,
  editInventoryView: invCont.editInventoryView,
  buildDeleteView: invCont.buildDeleteView,
  deleteInventory
}

