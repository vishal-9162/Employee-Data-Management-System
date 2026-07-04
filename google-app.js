// ============================================
// Google Apps Script - Web App
// ============================================
// 📋 Setup Instructions:
// 1. Go to Google Sheets → Extensions → Apps Script
// 2. Delete any existing code and paste this entire script
// 3. Click Deploy → New Deployment → Web App
// 4. Set "Execute as" = Me, "Who has access" = Anyone
// 5. Click Deploy and copy the Web App URL
// 6. Paste that URL in server.js (GOOGLE_SCRIPT_URL variable)
// ============================================

// Sheet name where data will be stored
const SHEET_NAME = "Employee Data";

// ===== Main POST Handler =====
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);

    // Append row with all columns
    sheet.appendRow([
      data.date || "",
      data.particulars || "",
      data.hasInvoice || "",
      data.invoiceNo || "",
      data.village || "",
      data.working || "",
      data.farmerName || "",
      data.contactNo || "",
      data.mode || "",
      data.kilometers || "",
      data.kilometerAmount || "",    // Stored as-is: "12+10+15"
      data.expenseType || "",
      data.otherExpenses || "",      // Stored as-is: "100+50"
      data.dailyAllowance || "",
      data.totalAmount || "",
      data.submissionTime || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data saved successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== GET Handler (for testing) =====
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Employee Data Management API is running!",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== Get or Create Sheet with Headers =====
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Set headers
    const headers = [
      "Date",
      "Particulars",
      "Invoice Available",
      "Invoice Number",
      "Village",
      "Working",
      "Farmer Name",
      "Contact Number",
      "Mode",
      "Number of Kilometers",
      "Kilometers Amount",
      "Expense Type",
      "Other Expenses Amount",
      "Daily Allowance",
      "Total Amount",
      "Submission Time"
    ];

    // Write headers to first row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Style headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1e3a8a");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }

    // Freeze header row
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// ===== Test Function =====
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        date: "2026-07-03",
        particulars: "Pump Installation",
        hasInvoice: "Yes",
        invoiceNo: "INV-001",
        village: "Rajpur",
        working: "Fitting",
        farmerName: "Ramesh Kumar",
        contactNo: "9876543210",
        mode: "Bus",
        kilometers: "45",
        kilometerAmount: "12+10+15",
        expenseType: "Hotel Amount",
        otherExpenses: "100+50",
        dailyAllowance: "200",
        totalAmount: "387",
        submissionTime: "03/07/2026, 10:30:00 AM"
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}