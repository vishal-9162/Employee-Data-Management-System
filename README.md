 Employee Data Management System
A professional Employee Travel & Expense Data Management System with a modern Glassmorphism UI design. This application allows employees to submit their travel and expense data which gets saved directly to Google Sheets.

Dark ThemeHTML5CSS3JavaScriptNode.js

✨ Features
🎨 Glassmorphism UI - Premium dark theme with animated gradient background
📝 Complete Form - All employee travel & expense fields
✅ Form Validation - Real-time validation with error messages
🧮 Auto Calculation - Total Amount auto-calculated from Kilometers + Other Expenses + Daily Allowance
🔄 Conditional Fields - Invoice Number field appears only when Invoice is selected
📊 Google Sheets Integration - Data saves directly to Google Sheets
🎉 Success Animation - Professional loading & success animations
📱 Responsive Design - Works on Mobile, Tablet & Desktop
🔒 Secure - Environment variables for sensitive URLs
📸 Screenshots
Form View	Success State
Form	Success
📁 Project Structure
employee-data-system/
├── index.html          # Main HTML form structure
├── style.css           # Glassmorphism UI & animations
├── script.js           # Form validation & submission logic
├── server.js           # Express backend server
├── google-app.js       # Google Apps Script (for Sheets)
├── .env                # Environment variables (NOT on GitHub)
├── .gitignore          # Files to ignore in Git
├── package.json        # Node.js dependencies
└── README.md           # This file
🚀 Getting Started
Prerequisites
Node.js (v14 or higher)
Git
A Google Account with Google Sheets access
Installation
Clone the repository

git clone https://github.com/YOUR-USERNAME/employee-data-system.git
cd employee-data-system
Install dependencies

npm install express cors node-fetch dotenv
Set up Google Sheets integration (see below)

Configure environment variables

# Create .env file
echo "GOOGLE_SCRIPT_URL=your-google-apps-script-url" > .env
echo "PORT=3000" >> .env
Start the server

node server.js
Open in browser

http://localhost:3000
📊 Google Sheets Setup
Step 1: Create Google Sheet
Go to Google Sheets and create a new sheet
Add these column headers in Row 1:
A	B	C	D	E	F	G	H	I	J	K	L	M	N	O	P
Timestamp	Employee Name	Designation	Department	Mobile Number	Travel Date	From Location	To Location	Travel Mode	Kilometers	Other Expenses	Daily Allowance	Total Amount	Invoice	Invoice Number	Remark
Step 2: Deploy Google Apps Script
Open your Google Sheet → Extensions → Apps Script
Delete any existing code and paste the content of google-app.js
Click Deploy → New Deployment
Select type: Web App
Set “Execute as” = Me
Set “Who has access” = Anyone
Click Deploy and authorize when prompted
Copy the Web App URL
Step 3: Add URL to .env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec
📋 Form Fields
Field	Type	Required	Description
Employee Name	Text	✅	Full name of employee
Designation	Text	✅	Job title/position
Department	Select	✅	Department name
Mobile Number	Tel	✅	10-digit Indian mobile number
Travel Date	Date	✅	Date of travel
From Location	Text	✅	Starting location
To Location	Text	✅	Destination location
Travel Mode	Select	✅	Mode of transport
Kilometers	Number	✅	Distance in km
Other Expenses	Number	✅	Additional expenses
Daily Allowance	Number	✅	Daily allowance amount
Total Amount	Number	Auto	Auto-calculated total
Invoice	Select	✅	Yes/No
Invoice Number	Text	Conditional	Required if Invoice = Yes
Remark	Textarea	❌	Additional notes
🎨 Design Details
Theme: Dark Premium Glassmorphism
Background: Animated gradient (Deep Blue → Purple → Cyan)
Font: Poppins (Google Fonts)
Glass Effect: Semi-transparent cards with blur backdrop
Animations: Smooth transitions, loading spinner, success checkmark
Responsive: Mobile-first design with breakpoints for tablet & desktop
🛠️ Tech Stack
Technology	Purpose
HTML5	Page structure & form
CSS3	Glassmorphism UI & animations
JavaScript	Form logic & validation
Node.js	Backend server
Express	API routing
Google Apps Script	Google Sheets integration
Dotenv	Environment variable management
📦 API Endpoints
Method	Endpoint	Description
GET	/	Serve the main HTML page
POST	/submit	Submit employee data to Google Sheets
🔒 Security
.env file is excluded from Git via .gitignore
Google Script URL is stored as environment variable
CORS enabled for secure cross-origin requests
Input validation on both client and server side
🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/new-feature)
Commit your changes (git commit -m "Add new feature")
Push to the branch (git push origin feature/new-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Employee Data Management System

🙏 Acknowledgments
Glassmorphism design inspiration
Google Sheets API documentation
Express.js community
⭐ If this project helped you, please give it a star on GitHub!
