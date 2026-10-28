
const query = require("../config/query");

const getOwnerDashboard = async (req, res) => {
  try {
const stores = await query(
  `SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating), 0) AS average_rating,
      COUNT(r.id) AS total_ratings,

      COALESCE(SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END), 0) AS five_star,
      COALESCE(SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END), 0) AS four_star,
      COALESCE(SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END), 0) AS three_star,
      COALESCE(SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END), 0) AS two_star,
      COALESCE(SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END), 0) AS one_star

   FROM stores s
   LEFT JOIN ratings r ON r.store_id = s.id
   WHERE s.owner_id = ?
   GROUP BY s.id, s.name, s.email, s.address`,
  [req.user.id]
);


    if (stores.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No store is currently assigned to your account",
        stores: [],
      });
    }

    return res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error("Owner dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve owner dashboard",
    });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const stores = await query(
      "SELECT id, name FROM stores WHERE id = ? AND owner_id = ?",
      [storeId, req.user.id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found or you do not own this store",
      });
    }

    const ratings = await query(
      `SELECT
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          r.rating,
          r.created_at,
          r.updated_at
       FROM ratings r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [storeId]
    );

    return res.status(200).json({
      success: true,
      store: stores[0],
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error("Get store ratings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve store ratings",
    });
  }
};

module.exports = {
  getOwnerDashboard,
  getStoreRatings,
};
