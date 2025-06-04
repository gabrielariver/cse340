const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  return data.rows
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get vehicle data by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

/* ***************************
 *  add Classification 
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    return null
  }
}
/* ***************************
 *  add inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles,
  inv_color, classification_id) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `
    const data = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id, inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles,
  inv_color, classification_id
) {
  try {
    const sql = `
      UPDATE inventory
      SET inv_make = $1,
          inv_model = $2,
          inv_year = $3,
          inv_description = $4,
          inv_image = $5,
          inv_thumbnail = $6,
          inv_price = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `;
    const data = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id, inv_id
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateInventory error:", error);
    return null;
  }
}

//w05 Team activity
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rowCount
  } catch (error) {
    console.error("deleteInventory error:", error)
    return null
  }
}

module.exports = {
  getClassifications,
  addClassification,
  getInventoryByClassificationId,
  getInventoryById,
  addInventory,
  updateInventory,
  deleteInventory
}
