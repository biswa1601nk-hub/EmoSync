<div align="center">
  <img src="https://img.shields.io/badge/Platform-Emotion_Monitoring-000000?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white" />
</div>

<h1 align="center">EmoSync Platform</h1>

<p align="center">
  <b>A High-Fidelity IoT Wearable Platform & Telemetry Dashboard</b><br/>
  Real-time spatial orientation and biometric analysis powered by hardware-to-cloud WebSocket integration.
</p>

---

## ✦ System Overview

**EmoSync** bridges the gap between raw hardware telemetry and high-end medical data visualization. By bypassing standard Bluetooth constraints and establishing deep local-network HTTP queues, EmoSync streams physically gathered biometric patterns (via ESP32 and MPU6050 components) directly into a React-powered, live-dispatch analytics dashboard. 

Built for extremely low latency, it is designed for environments demanding immediate visual feedback on physiological stress variance and spatial hardware tracking.

## ✦ Core Capabilities

- 📉 **Real-Time 3D Spatial Matrix** <br/>
  Dynamically maps live 6-axis MPU6050 accelerometer and gyroscope data onto a responsive CSS-rendered tracking reticle, matching the user's exact hand orientation in real-time.
- ⚡ **Zero-Latency WebSocket Architecture** <br/>
  Bi-directional Node.js streams instantly separate localized User-Node dashboards from the Global Admin monitoring map.
- 🔬 **MAXVitals Advanced Simulation Engine** <br/>
  In the absence of stable MAX30100 readings, an integrated algorithm generates flawless mathematical simulations simulating SpO2 drops, tachycardia, and stress cycles tied directly to the live orientation variables of the physical hardware.
- 🛡️ **Priority Escalation Admin Portals** <br/>
  Features a medical-grade Global Admin UI with clickable triage flagging, mathematical pagination, real-time 'Time Since Active' calculations, and live sub-routing queries using dynamic UI filtering.

---

## ✦ Technology Stack

### Application Layer
* **Frontend:** React 18, TypeScript, TailwindCSS, Chart.js, Vite, Lucide-React
* **Design Pattern:** Glassmorphic dark aesthetic with ambient CSS vector motion fields.

### Server & Database Layer
* **Backend:** Node.js, Express.js
* **Stream Protocol:** Socket.io (Bi-directional real-time events)
* **Storage:** MongoDB (User queuing & node history authentication)

### Hardware Node (IoT)
* **Microcontroller:** ESP32 (acting as an independent Local WebServer node)
* **Sensors:** MPU6050 (Spatial Accelerometer/Gyroscope)
* **Peripherals:** SSD1306 128x64 OLED Display (IP/Status readouts), 5V Active Buzzer for localized stress alerts.

---

## ✦ Getting Started

### 1. Backend Initialization
```bash
cd backend
npm install
# Create your .env file with MONGO_URI and port configurations
npm run start
```

### 2. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```

### 3. Hardware Deployment
1. Connect your ESP32 module.
2. In the Arduino script, modify your Local Hotspot/WiFi credentials.
3. Flash the `.ino` payload.
4. Your ESP32's onboard OLED screen will output its local Gateway IP address upon a successful server connection. Provide this IP directly into your React Personal Dashboard to pair your local biometric stream to the global server.

---

<p align="center">
  <br/>
  <i>Engineered for performance, scalability, and deep hardware symbiosis.</i>
  <br/>
  <sub>© 2026 EmoSync Platform. All Rights Reserved.</sub>
</p>
