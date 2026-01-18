# Band Finder 🎸

**Band Finder** is a full stack web platform designed to connect music bands with fans. It features a robust authentication system, real-time geolocation services, and a dedicated REST API for managing reviews.

## 🚀 Key Features

* **User & Band Ecosystem:** Distinct registration flows for Fans and Bands with server-side validation and persistent database storage.
* **Secure Authentication:** Complete Login/Logout system with Session management and password strength analysis.
* **Geolocation Integration:** Real-time address verification and interactive map rendering using **OpenStreetMap (Nominatim API)** and **OpenLayers**.
* **Reviews REST API:** A standalone API enabling users to Create, Read, Update, and Delete (CRUD) band reviews asynchronously.


## 🛠️ Tech Stack

* **Backend:** Node.js, MySQL
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (AJAX)
* **APIs:** OpenStreetMap, Custom REST API
* **Tools:** Postman

## 📦 Setup & Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your MySQL database connection.
4.  Start the server:
    ```bash
    node app.js
    ```

---
*Developed as an academic project for the Web Programming course (HY359), University of Crete.*
