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
const defaultSubmitLabel = submitBtn.innerHTML;

const phonePattern = /^[6-9]\d{9}$/;
const amountExpressionPattern = /^\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)*$/;

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

function calculateExpression(expr) {
    const sanitized = String(expr || "").trim();
    if (!sanitized) return 0;
    if (!amountExpressionPattern.test(sanitized)) return Number.NaN;

    return sanitized
        .split("+")
        .map(part => Number(part.trim()))
        .reduce((total, amount) => total + amount, 0);
}

function formatAmount(amount) {
    return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

function calculateTotal() {
    const kmTotal = calculateExpression(kilometerAmount.value);
    const otherTotal = calculateExpression(otherExpenses.value);
    const dailyTotal = Number(dailyAllowance.value || 0);

    if (!Number.isFinite(kmTotal) || !Number.isFinite(otherTotal) || !Number.isFinite(dailyTotal)) {
        totalAmount.value = "";
        return;
    }

    const total = kmTotal + otherTotal + dailyTotal;
    totalAmount.value = total > 0 ? `Rs. ${formatAmount(total)}` : "";
}

kilometerAmount.addEventListener("input", calculateTotal);
otherExpenses.addEventListener("input", calculateTotal);
dailyAllowance.addEventListener("input", calculateTotal);

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

function validateAmountExpression(fieldId, value, label, required = true) {
    const trimmed = String(value || "").trim();
    if (!trimmed) {
        if (required) {
            setFieldError(fieldId, `${label} is required`);
            return false;
        }
        return true;
    }

    if (!amountExpressionPattern.test(trimmed)) {
        setFieldError(fieldId, `${label} must use numbers joined by +, for example 12+10+15`);
        return false;
    }

    return true;
}

function validateForm() {
    let isValid = true;
    const fields = [
        "date", "particulars", "hasInvoice", "village",
        "working", "contactNo", "mode", "kilometers",
        "kilometerAmount", "expenseType", "dailyAllowance"
    ];

    fields.forEach(f => clearFieldError(f));
    clearFieldError("invoiceNo");

    const dateVal = document.querySelector("#date").value;
    if (!dateVal) {
        setFieldError("date", "Date is required");
        isValid = false;
    }

    const particularsVal = document.querySelector("#particulars").value.trim();
    if (!particularsVal) {
        setFieldError("particulars", "Particulars is required");
        isValid = false;
    }

    const invoiceVal = hasInvoice.value;
    if (!invoiceVal) {
        setFieldError("hasInvoice", "Please select invoice option");
        isValid = false;
    }

    if (invoiceVal === "Yes") {
        const invoiceNoVal = document.querySelector("#invoiceNo").value.trim();
        if (!invoiceNoVal) {
            setFieldError("invoiceNo", "Invoice number is required");
            isValid = false;
        }
    }

    const villageVal = document.querySelector("#village").value.trim();
    if (!villageVal) {
        setFieldError("village", "Village is required");
        isValid = false;
    }

    const workingVal = document.querySelector("#working").value;
    if (!workingVal) {
        setFieldError("working", "Please select working type");
        isValid = false;
    }

    const contactVal = document.querySelector("#contactNo").value.trim();
    if (!contactVal) {
        setFieldError("contactNo", "Contact number is required");
        isValid = false;
    } else if (!phonePattern.test(contactVal)) {
        setFieldError("contactNo", "Enter a valid 10 digit Indian mobile number");
        isValid = false;
    }

    const modeVal = document.querySelector("#mode").value;
    if (!modeVal) {
        setFieldError("mode", "Please select mode of travel");
        isValid = false;
    }

    const kmVal = Number(document.querySelector("#kilometers").value);
    if (!Number.isFinite(kmVal) || kmVal <= 0) {
        setFieldError("kilometers", "Number of kilometers must be greater than zero");
        isValid = false;
    }

    if (!validateAmountExpression("kilometerAmount", kilometerAmount.value, "Kilometer amount")) {
        isValid = false;
    }

    if (!validateAmountExpression("otherExpenses", otherExpenses.value, "Other expenses", false)) {
        isValid = false;
    }

    const expenseVal = document.querySelector("#expenseType").value;
    if (!expenseVal) {
        setFieldError("expenseType", "Please select expense type");
        isValid = false;
    }

    const dailyVal = Number(dailyAllowance.value);
    if (dailyAllowance.value === "") {
        setFieldError("dailyAllowance", "Daily allowance is required");
        isValid = false;
    } else if (!Number.isFinite(dailyVal) || dailyVal < 0) {
        setFieldError("dailyAllowance", "Daily allowance must be zero or greater");
        isValid = false;
    }

    return isValid;
}

document.querySelectorAll(".field input, .field select").forEach(el => {
    el.addEventListener("input", () => {
        if (el.value.trim()) {
            clearFieldError(el.id);
        }
    });
    el.addEventListener("change", () => {
        if (el.value.trim()) {
            clearFieldError(el.id);
        }
    });
});

function buildPayload() {
    const kmTotal = calculateExpression(kilometerAmount.value);
    const otherTotal = calculateExpression(otherExpenses.value);
    const dailyTotal = Number(dailyAllowance.value || 0);
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
        kilometerAmount: kilometerAmount.value.trim(),
        expenseType: document.querySelector("#expenseType").value,
        otherExpenses: otherExpenses.value.trim(),
        dailyAllowance: dailyAllowance.value,
        totalAmount: formatAmount(total),
        submissionTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };
}

function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.innerHTML = isSubmitting
        ? '<span class="btn-icon">...</span> Submitting...'
        : defaultSubmitLabel;
    loadingOverlay.classList.toggle("active", isSubmitting);
}

async function submitRegistration(payload) {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    let result = {};
    try {
        result = await response.json();
    } catch {
        result = {};
    }

    if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to submit data. Please try again.");
    }

    return result;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        const firstError = document.querySelector(".has-error");
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    }

    setSubmitting(true);

    try {
        await submitRegistration(buildPayload());
        formPanel.style.display = "none";
        successScreen.classList.add("active");
    } catch (error) {
        alert(error.message || "Something went wrong. Please try again.");
    } finally {
        setSubmitting(false);
    }
});

window.resetToForm = function() {
    successScreen.classList.remove("active");
    formPanel.style.display = "block";
    formPanel.style.animation = "slideUp 0.6s ease-out";
    form.reset();
    invoiceField.style.display = "none";
    totalAmount.value = "";
    setSubmitting(false);

    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));

    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.clearForm = function() {
    form.reset();
    invoiceField.style.display = "none";
    totalAmount.value = "";

    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));

    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#date").value = today;
});
