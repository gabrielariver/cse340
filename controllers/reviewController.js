const reviewModel = require("../models/review_model");
const utilities = require("../utilities");

async function addReview(req, res) {
  const { review_text, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    await reviewModel.addReview(review_text, inv_id, account_id);
    req.flash("notice", "Review added successfully.");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (err) {
    console.error("Error adding review: ", err);
    req.flash("notice", "Error adding review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = { addReview };