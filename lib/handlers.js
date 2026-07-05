const phonePattern = /^[6-9]\d{9}$/;
const amountExpressionPattern = /^\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)*$/;

const requiredFields = [
  "date",
  "particulars",
  "hasInvoice",
  "village",
  "working",
  "contactNo",
  "mode",
  "kilometers",
  "kilometerAmount",
  "expenseType",
  "dailyAllowance"
];

function getGoogleScriptUrl() {
  if (process.env.GOOGLE_SCRIPT_URL) {
    return process.env.GOOGLE_SCRIPT_URL;
  }

  const legacyKey = Object.keys(process.env).find((key) => /^GOOGLE_SCRIPT_URL_\d+$/.test(key));
  return legacyKey ? process.env[legacyKey] : "";
}

function isConfiguredGoogleScriptUrl(value) {
  if (!value || value === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseAmountExpression(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return 0;
  if (!amountExpressionPattern.test(normalized)) return Number.NaN;

  return normalized
    .split("+")
    .map((part) => Number(part.trim()))
    .reduce((total, amount) => total + amount, 0);
}

function validateRegistrationData(data) {
  const missingFields = requiredFields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (!["Yes", "No"].includes(data.hasInvoice)) {
    return "Invalid invoice option";
  }

  if (data.hasInvoice === "Yes" && !String(data.invoiceNo || "").trim()) {
    return "Invoice number is required when Invoice = Yes";
  }

  if (!phonePattern.test(String(data.contactNo || "").trim())) {
    return "Invalid Indian mobile number";
  }

  if (!amountExpressionPattern.test(String(data.kilometerAmount || "").trim())) {
    return "Invalid kilometer amount";
  }

  if (data.otherExpenses && !amountExpressionPattern.test(String(data.otherExpenses).trim())) {
    return "Invalid other expenses amount";
  }

  if (!Number.isFinite(Number(data.kilometers)) || Number(data.kilometers) <= 0) {
    return "Number of kilometers must be greater than zero";
  }

  if (!Number.isFinite(Number(data.dailyAllowance)) || Number(data.dailyAllowance) < 0) {
    return "Daily allowance must be zero or greater";
  }

  return "";
}

function buildRegistrationPayload(input) {
  const data = { ...input };
  const kmTotal = parseAmountExpression(data.kilometerAmount);
  const otherTotal = parseAmountExpression(data.otherExpenses);
  const dailyTotal = Number(data.dailyAllowance);

  data.particulars = String(data.particulars || "").trim();
  data.invoiceNo = String(data.invoiceNo || "").trim();
  data.village = String(data.village || "").trim();
  data.farmerName = String(data.farmerName || "").trim();
  data.contactNo = String(data.contactNo || "").trim();
  data.kilometerAmount = String(data.kilometerAmount || "").trim();
  data.otherExpenses = String(data.otherExpenses || "").trim();
  data.totalAmount = String(kmTotal + otherTotal + dailyTotal);
  data.submissionTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  return data;
}

async function postToGoogleSheets(data) {
  const googleScriptUrl = getGoogleScriptUrl();

  if (!isConfiguredGoogleScriptUrl(googleScriptUrl)) {
    const error = new Error("Google Sheets integration is not configured. Set GOOGLE_SCRIPT_URL.");
    error.statusCode = 500;
    throw error;
  }

  const fetch = (await import("node-fetch")).default;
  const response = await fetch(googleScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    redirect: "follow"
  });

  const responseText = await response.text();
  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    const error = new Error("Google Sheets returned an invalid response.");
    error.statusCode = 502;
    throw error;
  }

  if (!response.ok || result.status !== "success") {
    const error = new Error(result.message || "Failed to save data to Google Sheets");
    error.statusCode = 502;
    throw error;
  }

  return result;
}

async function handleRegister(req, res) {
  try {
    const validationError = validateRegistrationData(req.body || {});
    if (validationError) {
      return res.status(400).json({
        status: "error",
        message: validationError
      });
    }

    const data = buildRegistrationPayload(req.body);
    await postToGoogleSheets(data);

    console.log("Data saved to Google Sheets:", data.particulars);
    return res.status(200).json({
      status: "success",
      message: "Employee data submitted successfully!"
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal server error. Please try again."
    });
  }
}

function handleHealth(req, res) {
  res.status(200).json({
    status: "active",
    message: "Employee Data Management Server is running!",
    sheetsConfigured: isConfiguredGoogleScriptUrl(getGoogleScriptUrl()),
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  });
}

module.exports = {
  amountExpressionPattern,
  getGoogleScriptUrl,
  handleHealth,
  handleRegister,
  isConfiguredGoogleScriptUrl,
  parseAmountExpression,
  validateRegistrationData
};
