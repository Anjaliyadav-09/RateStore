
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const query = require("../config/query");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
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

    if (address.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    if (password.length < 8 || password.length > 16 ||
        !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8–16 characters and contain an uppercase letter and a special character",
      });
    }

    const existingUsers = await query(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [
        name.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        address.trim(),
        "user",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const users = await query(
      "SELECT id, name, email, password, address, role FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const users = await query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    // Do not reveal whether an account exists.
    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "If this email is registered, a reset link will be sent.",
      });
    }

    const user = users[0];

    // Generate a secure random token.
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Expire old unused reset tokens for this user.
    await query(
      "DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL",
      [user.id]
    );

    // Token expires in 15 minutes.
    await query(
      `INSERT INTO password_resets
       (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE))`,
      [user.id, tokenHash]
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "RateStore - Reset Your Password",
      text: `You requested a password reset. Open this link within 15 minutes: ${resetLink}\n\nIf you did not request this, ignore this email.`,
      html: `
        <h2>Reset Your RateStore Password</h2>
        <p>Click the button below to choose a new password. This link expires in 15 minutes.</p>
        <p>
          <a href="${resetLink}"
             style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "If this email is registered, a reset link will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  const connection = await require("../config/db").pool.getConnection();

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
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
        message:
          "Password must be 8–16 characters and contain an uppercase letter and a special character",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connection.beginTransaction();

    const [resetRows] = await connection.execute(
      `SELECT id, user_id
       FROM password_resets
       WHERE token_hash = ?
         AND used_at IS NULL
         AND expires_at > UTC_TIMESTAMP()
       LIMIT 1
       FOR UPDATE`,
      [tokenHash]
    );

    if (resetRows.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Reset link is invalid, expired, or already used",
      });
    }

    const reset = resetRows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, reset.user_id]
    );

    await connection.execute(
      "UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE id = ?",
      [reset.id]
    );

    // Invalidate any other outstanding reset links for this user.
    await connection.execute(
      `UPDATE password_resets
       SET used_at = UTC_TIMESTAMP()
       WHERE user_id = ? AND used_at IS NULL`,
      [reset.user_id]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};
