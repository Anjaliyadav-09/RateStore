
const query = require("../config/query");

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const numericStoreId = Number(storeId);
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericStoreId) ||
      numericStoreId <= 0 ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid store ID and a rating between 1 and 5",
      });
    }

    const stores = await query(
      "SELECT id FROM stores WHERE id = ?",
      [numericStoreId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         rating = VALUES(rating),
         updated_at = CURRENT_TIMESTAMP`,
      [req.user.id, numericStoreId, numericRating]
    );

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error("Submit rating error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit rating",
    });
  }
};


const getAllRatings = async (req, res) => {
  try {
    const ratings = await query(`
      SELECT
        r.id,
        r.user_id,
        r.store_id,
        r.rating,
        r.created_at,
        r.updated_at,
        u.name AS user_name,
        u.email AS user_email,
        s.name AS store_name
      FROM ratings r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN stores s ON r.store_id = s.id
      ORDER BY r.updated_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error("Get all ratings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch ratings",
    });
  }
};


module.exports = {
  submitRating,
  getAllRatings,
};
