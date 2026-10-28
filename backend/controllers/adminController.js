
const query = require("../config/query");

const getDashboardStats = async (req, res) => {
  try {
    const userCount = await query(
      "SELECT COUNT(*) AS total FROM users"
    );

    const storeCount = await query(
      "SELECT COUNT(*) AS total FROM stores"
    );

    const ratingCount = await query(
      "SELECT COUNT(*) AS total FROM ratings"
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount[0].total,
        totalStores: storeCount[0].total,
        totalRatings: ratingCount[0].total,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics",
    });
  }
};


const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Store name, email, and address are required",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingStore = await query(
      "SELECT id FROM stores WHERE email = ?",
      [normalizedEmail]
    );

    if (existingStore.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A store with this email already exists",
      });
    }

    let validOwnerId = null;

    if (ownerId !== undefined && ownerId !== null && ownerId !== "") {
      const owners = await query(
        "SELECT id FROM users WHERE id = ? AND role = 'store_owner'",
        [ownerId]
      );

      if (owners.length === 0) {
        return res.status(400).json({
          success: false,
          message: "A valid store-owner account was not found",
        });
      }

      validOwnerId = ownerId;
    }

    await query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), normalizedEmail, address.trim(), validOwnerId]
    );

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
    });
  } catch (error) {
    console.error("Create store error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create store",
    });
  }
};


const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    // Validate store ID
    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof address !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !address.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Store name, email, and address are required",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    const storeId = Number(id);
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the store exists
    const existingStores = await query(
      "SELECT id FROM stores WHERE id = ?",
      [storeId]
    );

    if (existingStores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check for duplicate email belonging to another store
    const duplicateEmail = await query(
      "SELECT id FROM stores WHERE email = ? AND id != ?",
      [normalizedEmail, storeId]
    );

    if (duplicateEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Another store already uses this email",
      });
    }

    // Validate the optional store owner
    let validOwnerId = null;

    if (ownerId !== undefined && ownerId !== null && ownerId !== "") {
      const owners = await query(
        "SELECT id FROM users WHERE id = ? AND role = 'store_owner'",
        [ownerId]
      );

      if (owners.length === 0) {
        return res.status(400).json({
          success: false,
          message: "A valid store-owner account was not found",
        });
      }

      validOwnerId = ownerId;
    }

    // Update store details
    await query(
      `UPDATE stores
       SET name = ?, email = ?, address = ?, owner_id = ?
       WHERE id = ?`,
      [
        name.trim(),
        normalizedEmail,
        address.trim(),
        validOwnerId,
        storeId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Store updated successfully",
    });
  } catch (error) {
    console.error("Update store error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update store",
    });
  }
};


const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate store ID
    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const storeId = Number(id);

    // Check whether the store exists
    const existingStores = await query(
      "SELECT id FROM stores WHERE id = ?",
      [storeId]
    );

    if (existingStores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Delete the store
    await query(
      "DELETE FROM stores WHERE id = ?",
      [storeId]
    );

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Delete store error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete store. It may have associated ratings.",
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userId = Number(id);

    // Prevent admin from deleting their own account
    if (Number(req.user.id) === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Check whether the user exists
    const existingUsers = await query(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user
    await query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete user. The user may have associated records.",
    });
  }
};




const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const allowedRoles = ["admin", "user", "store_owner"];

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    if (
      password.length < 8 ||
      password.length > 16 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8–16 characters and contain an uppercase letter and a special character",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUsers = await query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), normalizedEmail, hashedPassword, address.trim(), role]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create user",
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    const allowedRoles = ["admin", "user", "store_owner"];

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!name || !email || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, address, and role are required",
      });
    }

    if (name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const userId = Number(id);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUsers = await query(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const duplicateEmail = await query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [normalizedEmail, userId]
    );

    if (duplicateEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered to another user",
      });
    }

    await query(
      `UPDATE users
       SET name = ?, email = ?, address = ?, role = ?
       WHERE id = ?`,
      [name.trim(), normalizedEmail, address.trim(), role, userId]
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update user",
    });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      role,
      sortBy = "name",
      order = "ASC",
    } = req.query;

    const allowedSortColumns = {
      name: "name",
      email: "email",
      address: "address",
      role: "role",
    };

    const sortColumn = allowedSortColumns[sortBy] || "name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    let sql = `
      SELECT id, name, email, address, role, created_at
      FROM users
      WHERE (name LIKE ? OR email LIKE ? OR address LIKE ?)
    `;

    const searchTerm = `%${search.trim()}%`;
    const params = [searchTerm, searchTerm, searchTerm];

    if (role && ["admin", "user", "store_owner"].includes(role)) {
      sql += " AND role = ?";
      params.push(role);
    }

    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const users = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users",
    });
  }
};


const getAllStores = async (req, res) => {
  try {
    const {
      search = "",
      sortBy = "name",
      order = "ASC",
    } = req.query;

    const allowedSortColumns = {
      name: "s.name",
      email: "s.email",
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
          s.owner_id,
          u.name AS owner_name,
          COALESCE(AVG(r.rating), 0) AS average_rating
       FROM stores s
       LEFT JOIN users u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name LIKE ?
          OR s.email LIKE ?
          OR s.address LIKE ?
       GROUP BY
          s.id, s.name, s.email, s.address, s.owner_id, u.name
       ORDER BY ${sortColumn} ${sortOrder}`,
      [searchTerm, searchTerm, searchTerm]
    );

    return res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get all stores error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve stores",
    });
  }
};


module.exports = {
  getDashboardStats,
  createStore,
  updateStore,
  deleteStore,
   deleteUser,
  createUser,
  updateUser,
  getAllUsers,
  getAllStores,
};
