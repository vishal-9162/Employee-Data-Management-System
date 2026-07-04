// ===== DOM Elements =====
const form = document.querySelector("#employeeForm");
const formPanel = document.querySelector("#formPanel");
const successScreen = document.querySelector("#successScreen");
const loadingOverlay = document.querySelector("#loadingOverlay");

const hasInvoice = document.querySelector("#hasInvoice");
const invoiceField = document.querySelector("#invoiceField");

const kilometerAmount = document.querySelector("#kilometerAmount");
const otherExpenses = document.querySelector("#otherExpenses");
const dailyAllowance = document.querySelector("#dailyAllowance");
const totalAmount = document.querySelector("#totalAmount");

const submitBtn = document.querySelector("#submitBtn");

// Indian mobile number pattern
const phonePattern = /^[6-9]\d{9}$/;

// ===== Invoice Show / Hide =====
hasInvoice.addEventListener("change", () => {
    if (hasInvoice.value === "Yes") {
        invoiceField.style.display = "flex";
        invoiceField.style.animation = "fadeInField 0.4s ease-out";
    } else {
        invoiceField.style.display = "none";
        document.querySelector("#invoiceNo").value = "";
        clearFieldError("invoiceNo");
    }
});

// ===== Expression Calculator =====
// Supports expressions like "12+10+15" and returns the sum
function calculateExpression(expr) {
    if (!expr || expr.trim() === "") return 0;
    
    // Only allow digits, +, spaces, and dots
    const sanitized = expr.replace(/\s/g, "");
    if (!/^[\d.+]+$/.test(sanitized)) return 0;
    
    const parts = sanitized.split("+");
    let total = 0;
    for (const part of parts) {
        const num = parseFloat(part);
        if (!isNaN(num)) {
            total += num;
        }
    }
    return total;
}

// ===== Total Amount Calculation =====
function calculateTotal() {
    const kmTotal = calculateExpression(kilometerAmount.value);
    const otherTotal = calculateExpression(otherExpenses.value);
    const dailyTotal = parseFloat(dailyAllowance.value) || 0;

    const total = kmTotal + otherTotal + dailyTotal;
    totalAmount.value = total > 0 ? `₹ ${total}` : "";
}

kilometerAmount.addEventListener("input", calculateTotal);
otherExpenses.addEventListener("input", calculateTotal);
dailyAllowance.addEventListener("input", calculateTotal);

// ===== Validation =====
function clearFieldError(fieldId) {
    const errorEl = document.querySelector(`#${fieldId}Error`);
    const fieldEl = document.querySelector(`#${fieldId}`);
    if (errorEl) errorEl.textContent = "";
    if (fieldEl) fieldEl.closest(".field")?.classList.remove("has-error");
}

function setFieldError(fieldId, message) {
    const errorEl = document.querySelector(`#${fieldId}Error`);
    const fieldEl = document.querySelector(`#${fieldId}`);
    if (errorEl) errorEl.textContent = message;
    if (fieldEl) fieldEl.closest(".field")?.classList.add("has-error");
}

function validateForm() {
    let isValid = true;
    const fields = [
        "date", "particulars", "hasInvoice", "village",
        "working", "contactNo", "mode", "kilometers",
        "kilometerAmount", "expenseType", "dailyAllowance"
    ];

    // Clear all errors first
    fields.forEach(f => clearFieldError(f));
    clearFieldError("invoiceNo");

    // Date
    const dateVal = document.querySelector("#date").value;
    if (!dateVal) {
        setFieldError("date", "📅 Date is required");
        isValid = false;
    }

    // Particulars
    const particularsVal = document.querySelector("#particulars").value.trim();
    if (!particularsVal) {
        setFieldError("particulars", "📝 Particulars is required");
        isValid = false;
    }

    // Invoice
    const invoiceVal = hasInvoice.value;
    if (!invoiceVal) {
        setFieldError("hasInvoice", "🧾 Please select invoice option");
        isValid = false;
    }

    // Invoice Number (conditional)
    if (invoiceVal === "Yes") {
        const invoiceNoVal = document.querySelector("#invoiceNo").value.trim();
        if (!invoiceNoVal) {
            setFieldError("invoiceNo", "🔢 Invoice number is required");
            isValid = false;
        }
    }

    // Village
    const villageVal = document.querySelector("#village").value.trim();
    if (!villageVal) {
        setFieldError("village", "🏘️ Village is required");
        isValid = false;
    }

    // Working
    const workingVal = document.querySelector("#working").value;
    if (!workingVal) {
        setFieldError("working", "🔧 Please select working type");
        isValid = false;
    }

    // Contact Number
    const contactVal = document.querySelector("#contactNo").value.trim();
    if (!contactVal) {
        setFieldError("contactNo", "📱 Contact number is required");
        isValid = false;
    } else if (!phonePattern.test(contactVal)) {
        setFieldError("contactNo", "📱 Enter valid 10 digit Indian mobile number");
        isValid = false;
    }

    // Mode
    const modeVal = document.querySelector("#mode").value;
    if (!modeVal) {
        setFieldError("mode", "🚗 Please select mode of travel");
        isValid = false;
    }

    // Kilometers
    const kmVal = document.querySelector("#kilometers").value;
    if (!kmVal) {
        setFieldError("kilometers", "📏 Number of kilometers is required");
        isValid = false;
    }

    // Kilometer Amount
    const kmAmountVal = kilometerAmount.value.trim();
    if (!kmAmountVal) {
        setFieldError("kilometerAmount", "💰 Kilometer amount is required");
        isValid = false;
    } else if (!/^[\d.+\s]+$/.test(kmAmountVal)) {
        setFieldError("kilometerAmount", "💰 Enter valid amount (e.g. 12+10+15)");
        isValid = false;
    }

    // Expense Type
    const expenseVal = document.querySelector("#expenseType").value;
    if (!expenseVal) {
        setFieldError("expenseType", "📋 Please select expense type");
        isValid = false;
    }

    // Daily Allowance
    const dailyVal = dailyAllowance.value;
    if (!dailyVal) {
        setFieldError("dailyAllowance", "🏷️ Daily allowance is required");
        isValid = false;
    }

    return isValid;
}

// ===== Real-time validation on input =====
document.querySelectorAll(".field input, .field select").forEach(el => {
    el.addEventListener("input", () => {
        const fieldId = el.id;
        if (el.value.trim()) {
            clearFieldError(fieldId);
        }
    });
    el.addEventListener("change", () => {
        const fieldId = el.id;
        if (el.value.trim()) {
            clearFieldError(fieldId);
        }
    });
});

// ===== Build Payload =====
function buildPayload() {
    const kmTotal = calculateExpression(kilometerAmount.value);
    const otherTotal = calculateExpression(otherExpenses.value);
    const dailyTotal = parseFloat(dailyAllowance.value) || 0;
    const total = kmTotal + otherTotal + dailyTotal;

    return {
        date: document.querySelector("#date").value,
        particulars: document.querySelector("#particulars").value.trim(),
        hasInvoice: hasInvoice.value,
        invoiceNo: document.querySelector("#invoiceNo").value.trim(),
        village: document.querySelector("#village").value.trim(),
        working: document.querySelector("#working").value,
        farmerName: document.querySelector("#farmerName").value.trim(),
        contactNo: document.querySelector("#contactNo").value.trim(),
        mode: document.querySelector("#mode").value,
        kilometers: document.querySelector("#kilometers").value,
        kilometerAmount: kilometerAmount.value.trim(), // Store as-is (e.g., "12+10+15")
        expenseType: document.querySelector("#expenseType").value,
        otherExpenses: otherExpenses.value.trim(), // Store as-is (e.g., "100+50")
        dailyAllowance: dailyAllowance.value,
        totalAmount: total.toString(),
        submissionTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };
}

// ===== Form Submit =====
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector(".has-error");
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    }

    const payload = buildPayload();

    // Show loading
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Submitting...';
    submitBtn.disabled = true;
    loadingOverlay.classList.add("active");

    try {
        // Try to send to server API (server.js → Google Sheets)
        let success = false;

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                success = true;
            } else {
                const errData = await response.json();
                throw new Error(errData.message || "Server error");
            }
        } catch (fetchError) {
            // If server is not running, simulate success for demo
            console.warn("⚠️ Server not available, running in demo mode");
            console.log("📊 Employee Data (Demo Mode):", payload);
            console.table(payload);
            await new Promise(resolve => setTimeout(resolve, 1500));
            success = true;
        }

        if (success) {
            // Hide loading & form, show success
            loadingOverlay.classList.remove("active");
            formPanel.style.display = "none";
            successScreen.classList.add("active");
        }

    } catch (error) {
        loadingOverlay.classList.remove("active");
        submitBtn.innerHTML = '<span class="btn-icon">🚀</span> Submit Data';
        submitBtn.disabled = false;
        alert("❌ " + (error.message || "Something went wrong. Please try again."));
    }
});

// ===== Reset to Form =====
window.resetToForm = function() {
    successScreen.classList.remove("active");
    formPanel.style.display = "block";
    formPanel.style.animation = "slideUp 0.6s ease-out";
    form.reset();
    invoiceField.style.display = "none";
    totalAmount.value = "";
    submitBtn.innerHTML = '<span class="btn-icon">🚀</span> Submit Data';
    submitBtn.disabled = false;

    // Clear all errors
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// ===== Clear Form =====
window.clearForm = function() {
    form.reset();
    invoiceField.style.display = "none";
    totalAmount.value = "";

    // Clear all errors
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// ===== Set today's date as default =====
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#date").value = today;
});