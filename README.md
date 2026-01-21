# Restaurant IoT Table Management System

A full-stack IoT system for managing restaurant table statuses using React, Python (FastAPI), MongoDB, and ESP32/ESP8266 microcontrollers.

## 🚀 Features
- **Chef Dashboard**: Real-time view of all tables.
- **Status Management**: Toggle statuses (Idle, Placed, Processing, Delivered).
- **IoT Integration**: LEDs on tables update automatically based on status.
- **Authentication**: Secure Chef login with JWT.
- **Dark Mode UI**: Professional kitchen aesthetic.

## 🛠 Tech Stack
- **Frontend**: React.js, Vite, Axios, CSS Modules (Dark Theme)
- **Backend**: Python, FastAPI, Motor (MongoDB Driver), JWT
- **Database**: MongoDB
- **Firmware**: Arduino C++ (ESP32 / ESP8266)

## 📦 Setup Instructions

### 1. Backend Setup
1. Navigate to `server/`
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file (if needed).
5. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Server runs at: `http://localhost:8000`

### 2. Frontend Setup
1. Navigate to `client/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`
5. **Default Login**: Register a user via API first or use the registration endpoint (or just add one manually to DB for now if no register UI). 
   *Note: You can use Swagger docs at `http://localhost:8000/docs` to `POST /api/auth/register` a new user.*

### 3. IoT Firmware Setup
1. Open `firmware/ESP32/ESP32.ino` or `firmware/ESP8266/ESP8266.ino` in Arduino IDE.
2. Update:
   - `ssid` & `password`: Your WiFi credentials.
   - `serverUrl`: Your PC's IP address (e.g., `http://192.168.1.5:8000/api/iot/table-status`).
   - `tableId`: Unique ID for the table (must match an ID created in the Dashboard).
3. Flash the code to your ESP board.
4. Wire LEDs to the defined pins.

## 📡 API Endpoints
- `POST /api/auth/login` - Chef Login
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Add table
- `PUT /api/tables/:id` - Update status/active
- `POST /api/iot/table-status` - IoT device polling

## 📸 Usage
1. Chef adds a table (e.g., "Table 1") with ID "T1".
2. ESP32 is flashed with `tableId = "T1"`.
3. Chef changes status to "Processing".
4. ESP32 sees the update and turns on the Yellow LED.
