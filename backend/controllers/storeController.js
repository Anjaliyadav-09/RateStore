
const query = require("../config/query");

const getStores = async (req, res) => {
  try {
    const { search = "", sortBy = "name", order = "ASC" } = req.query;

    const allowedSortColumns = {
      name: "s.name",
      address: "s.address",
      rating: "average_rating",
    };

    const sortColumn = allowedSortColumns[sortBy] || "s.name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const searchTerm = `%${search.trim()}%`;

    const stores = await query(
      `SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          COALESCE(AVG(r.rating), 0) AS average_rating,
          COALESCE(
            MAX(CASE WHEN r.user_id = ? THEN r.rating END),
            0
          ) AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name LIKE ? OR s.address LIKE ?
       GROUP BY s.id, s.name, s.email, s.address
       ORDER BY ${sortColumn} ${sortOrder}`,
      [req.user.id, searchTerm, searchTerm]
    );

    return res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve stores",
    });
  }
};

module.exports = {
  getStores,
};
