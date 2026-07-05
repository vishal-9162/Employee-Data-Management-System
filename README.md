# Employee Data Management System

Employee travel and expense entry app with a static frontend, an Express backend, and Google Sheets storage through Google Apps Script.

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- script.js
|-- server.js
|-- lib/
|   `-- handlers.js
|-- api/
|   |-- register.js
|   `-- health.js
|-- google-app.js
|-- vercel.json
|-- package.json
`-- .env.example
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec
PORT=3000
```

3. Start the app:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

## Google Sheets Setup

1. Create a Google Sheet.
2. Open `Extensions > Apps Script`.
3. Paste the contents of `google-app.js`.
4. Deploy as a Web App.
5. Set `Execute as` to `Me`.
6. Set access to the users who should be able to submit, or `Anyone` if this form is public.
7. Copy the Web App URL into `GOOGLE_SCRIPT_URL`.

The Apps Script creates an `Employee Data` sheet with these columns:

```text
Date, Particulars, Invoice Available, Invoice Number, Village, Working,
Farmer Name, Contact Number, Mode, Number of Kilometers, Kilometers Amount,
Expense Type, Other Expenses Amount, Daily Allowance, Total Amount,
Submission Time
```

## API

`GET /api/health`

Returns server health and whether the Google Sheets URL is configured.

`POST /api/register`

Accepts the employee travel and expense payload, validates it, and forwards it to Google Sheets.

Required fields:

```text
date, particulars, hasInvoice, village, working, contactNo, mode,
kilometers, kilometerAmount, expenseType, dailyAllowance
```

`invoiceNo` is required when `hasInvoice` is `Yes`.

Amount fields support simple plus expressions such as `12+10+15`.

## Deployment

The Vercel deployment uses:

```text
api/register.js
api/health.js
```

Set `GOOGLE_SCRIPT_URL` in Vercel project environment variables before deploying.

## Security Notes

`.env` is ignored and should not be committed. If a real Google Apps Script URL or secret was previously committed, rotate it and remove it from git history before publishing the repository.
