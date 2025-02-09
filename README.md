# 📊 Full-Stack Chart Application (MERN Stack)

## 📌 Project Overview  
This is a full-stack chart application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. The application allows users to visualize data dynamically using interactive charts.

## 🚀 Features  
- 📊 Dynamic & interactive charts  
- 📡 Fetches real-time data from the backend  
- 💾 Stores chart data in MongoDB  
- 🎨 User-friendly interface with React  
- 🔒 Secure API using authentication (if implemented)  
- 📈 Supports multiple chart types (e.g., bar, line, pie)  

## 🛠 Tech Stack  
### Frontend:  
- React.js  
- Chart.js / Recharts / D3.js (for charts)  
- Axios (for API calls)  
- Tailwind CSS / Bootstrap / Material-UI (for styling)  

### Backend:  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication (if implemented)  

## 🎯 Setup & Installation  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/yourusername/fullstack-chart-app.git
cd fullstack-chart-app
```
### 2 Backend Setup  
1. Navigate to the backend directory:  
   ```sh
   cd backend
   npm install
   ```
2. Install dependencies:
```sh
  npm install
```
3. Create a .env file inside the backend folder and add the following variables:
```sh
  MONGO_URI=your_mongodb_connection_string
  PORT=5000
  JWT_SECRET=your_secret_key
```
4. Start the backend server:
```sh
  Start the backend server:
```
### 3 Frontend Setup  

```sh
  cd frontend
  npm install
  npm start
```
# 📌 API Documentation - Full-Stack Chart Application

This document provides details about the API endpoints used in the **Full-Stack Chart Application (MERN Stack)**.

## 🛠 Base URL  
**Local Development:**  

---

## 📊 Chart API Endpoints  

### 1️⃣ Fetch All Charts  
**📌 Endpoint:**  
```http
GET /api/charts


