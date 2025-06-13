const pool = require("../database/")

/* Insert new review */
async function addReview(review_text, inv_id, account_id) {
  const sql = `
    INSERT INTO reviews (review_text, inv_id, account_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `
  const result = await pool.query(sql, [review_text, inv_id, account_id])
  return result.rows[0]
}

async function getReviewsByInvId(inv_id) {
  const sql = `
    SELECT r.review_text, r.review_date, a.account_firstname
    FROM reviews r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC;
  `
  const result = await pool.query(sql, [inv_id])
  return result.rows
}

module.exports = { addReview, getReviewsByInvId }
