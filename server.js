const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const {
  getGoogleScriptUrl,
  handleHealth,
  handleRegister,
  isConfiguredGoogleScriptUrl
} = require("./lib/handlers");

const app = express();
const PORT = process.env.PORT || 3000;

if (!isConfiguredGoogleScriptUrl(getGoogleScriptUrl())) {
  console.warn("WARNING: GOOGLE_SCRIPT_URL is not configured. Form submissions will fail until it is set.");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));

app.post("/api/register", handleRegister);
app.get("/api/health", handleHealth);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Employee Data Management Server running on http://localhost:${PORT}`);
  console.log("API endpoint: /api/register");
  console.log("Health check: /api/health");
});
