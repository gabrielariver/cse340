const invModel = require("../models/inventory-model")
const classificationValidation = require("./classification-validation")
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {} 

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)

  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/classification/' + row.classification_id +
      '" title="See our inventory of ' + row.classification_name + ' vehicles">' +
      row.classification_name + '</a>'
    list += "</li>"
  })

  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildVehicleDetail = function(vehicle) {
  return `
    <section class="vehicle-detail-container">
      <div class="vehicle-detail-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        <p><strong>Price:</strong> $${Number(vehicle.inv_price).toLocaleString("en-US")}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString("en-US")}</p>
      </div>
    </section>
  `
}

/* **************************************
 * Build the classification drop-down list
 * ************************************ */
Util.buildClassificationList = async function (selectedId = null) {
  let data = await invModel.getClassifications()
  let list = '<select id="classification_id" name="classification_id" required>'
  list += "<option value=''>Choose a Classification</option>"

  data.forEach((row) => {
    list += `<option value="${row.classification_id}"`
    if (selectedId == row.classification_id) {
      list += " selected"
    }
    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

Util.classificationRules = classificationValidation.classificationRules
Util.checkClassificationData = classificationValidation.checkClassificationData
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      }
    );
  } else {
    next();
  }
};

module.exports = {
  ...Util
}
