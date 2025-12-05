## AgriRelief SL - Walkthrough
# Overview
AgriRelief SL is a web application designed to help Sri Lankan farmers report farmland damage caused by natural disasters and connect them with public aid.

# Features
Authentication: Role-based login for Farmers and Donors/Public.
Farmer Reporting: Secure form for farmers to report damage with location and photos.
Public Aid Map: Interactive map showing active damage reports with filtering capabilities.
Admin Dashboard: Interface for officials to verify reports.
Setup Instructions
Install Dependencies:

     npm install


# Configure Firebase:

Open 
   src/services/firebase.js
.
Replace the placeholder values in firebaseConfig with your actual Firebase project keys.


# Run Locally:

    npm run dev
Access the app at http://localhost:5173.

# Usage Guide
1. Authentication
Sign Up: Create an account as a "Farmer" or "Donor/Public".
Login: Access your account.
2. Farmer Reporting (Farmers Only)
Navigate to "Start Report" from the home screen.
Fill in personal details, land size, and damage specifics.
Use "Use My Location" to capture GPS coordinates.
Upload photos of the damage.
Submit the report.
3. Public Aid Map (All Users)
Navigate to "View Map".
See markers for reported damages (Red: Landslide, Blue: Flood, Green: Other).
Click markers to see details and contact the farmer.
Use the sidebar to filter by specific needs (e.g., "Seeds", "Heavy Machines").
4. Admin Dashboard
Navigate to /admin.
View a list of all reports.
Click "Verify" to mark a report as verified.

# Tech Stack
Frontend: React, Vite, Tailwind CSS
Maps: React-Leaflet, OpenStreetMap
Backend: Firebase (Auth, Firestore, Storage)