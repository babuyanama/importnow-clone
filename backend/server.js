require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ADMIN LOGIN API - BCRYPT
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const validUsername =
      username === process.env.ADMIN_USERNAME;

    const validPassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );
console.log("Admin login diagnostic:", {
  usernameMatches: validUsername,
  passwordMatches: validPassword,
  hashLoaded: !!process.env.ADMIN_PASSWORD_HASH,
  jwtLoaded: !!process.env.JWT_SECRET
});
    if (!validUsername || !validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
    });

  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process login.",
    });
  }
});

// JWT AUTHENTICATION MIDDLEWARE
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
}

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("ImportNow Backend is Running!");
});

// CREATE ENQUIRY API - PUBLIC
app.post("/api/enquiries", (req, res) => {
  const { name, email, product, quantity, details } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof product !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !product.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and product are required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  const sql = `
    INSERT INTO enquiries (name, email, product, quantity, details)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    name.trim(),
    email.trim(),
    product.trim(),
    typeof quantity === "string" ? quantity.trim() || null : null,
    typeof details === "string" ? details.trim() || null : null,
  ];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Database error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to save your enquiry.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Enquiry saved successfully!",
      enquiryId: result.insertId,
    });
  });
});

// READ ENQUIRIES API - PROTECTED

  app.get("/api/enquiries", authenticateAdmin, (req, res) => {
  console.log("GET /api/enquiries called");

  const sql = "SELECT * FROM importnow_db.enquiries ORDER BY created_at DESC";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Records fetched:", results.length);
    console.log("Enquiry data:", results);

    return res.status(200).json({
      success: true,
      total: results.length,
      enquiries: results,
    });
  });
});

// UPDATE ENQUIRY API - PROTECTED
app.put("/api/enquiries/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, email, product, quantity, details } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid enquiry ID.",
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof product !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !product.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and product are required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  const sql = `
    UPDATE enquiries
    SET name = ?, email = ?, product = ?, quantity = ?, details = ?
    WHERE id = ?
  `;

  const values = [
    name.trim(),
    email.trim(),
    product.trim(),
    typeof quantity === "string" ? quantity.trim() || null : null,
    typeof details === "string" ? details.trim() || null : null,
    id,
  ];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Update error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to update enquiry.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found or no changes made.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully!",
    });
  });
});

// DELETE ENQUIRY API - PROTECTED
app.delete("/api/enquiries/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid enquiry ID.",
    });
  }

  const sql = "DELETE FROM enquiries WHERE id = ?";

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error("Delete error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to delete enquiry.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully!",
    });
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
