// ============================================
// Server.js - Express.js Backend
// ============================================
// 📋 Setup Instructions:
// 1. Install Node.js (https://nodejs.org)
// 2. Run: npm init -y
// 3. Run: npm install express cors node-fetch
// 4. Replace GOOGLE_SCRIPT_URL with your Google Apps Script Web App URL
// 5. Run: node server.js
// 6. Server will start on http://localhost:3000
// ============================================

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Google Apps Script Web App URL (from .env) =====
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
  console.warn("⚠️  WARNING: GOOGLE_SCRIPT_URL not set in .env file!");
  console.warn("⚠️  Create a .env file and add your Google Apps Script Web App URL.");
  console.warn("⚠️  Example: GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/xxxxx/exec");
}

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "/")));

// ===== API Route - Submit Employee Data =====
app.post("/api/register", async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = [
      "date", "particulars", "hasInvoice", "village",
      "working", "contactNo", "mode", "kilometers",
      "kilometerAmount", "dailyAllowance"
    ];

    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    // Validate Indian mobile number
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(data.contactNo)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Indian mobile number"
      });
    }

    // Invoice number required if invoice = Yes
    if (data.hasInvoice === "Yes" && !data.invoiceNo) {
      return res.status(400).json({
        status: "error",
        message: "Invoice number is required when Invoice = Yes"
      });
    }

    // Add submission time
    data.submissionTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    // Send data to Google Sheets via Apps Script
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      redirect: "follow"
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log("✅ Data saved to Google Sheets:", data.particulars);
      return res.status(200).json({
        status: "success",
        message: "Employee data submitted successfully!"
      });
    } else {
      console.error("❌ Google Sheets Error:", result.message);
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to save data to Google Sheets"
      });
    }

  } catch (error) {
    console.error("❌ Server Error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again."
    });
  }
});

// ===== API Route - Health Check =====
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Employee Data Management Server is running!",
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  });
});

// ===== Serve index.html for root =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║  🚀 Employee Data Management Server         ║
  ║  📡 Running on: http://localhost:${PORT}       ║
  ║  📊 API Endpoint: /api/register              ║
  ║  💚 Health Check: /api/health                ║
  ╚══════════════════════════════════════════════╝
  `);
});