# 🛡️ EmoSync | Precision IoT Biometric Telemetry Portal
EmoSync is a high-fidelity IoT wearable platform and medical data visualization dashboard. By bypassing standard Bluetooth constraints and establishing deep local-network HTTP queues, EmoSync streams physically gathered biometric patterns (via ESP32 and MPU6050 components) directly into a React-powered, live-dispatch analytics dashboard. 

## 🚀 Key Features
- **Real-Time 3D Spatial Matrix:** Dynamically maps live 6-axis MPU6050 accelerometer and gyroscope data onto a responsive structural CSS tracking reticle.
- **Zero-Latency WebSocket Architecture:** Bi-directional Node.js streams that cleanly separate localized User-Node dashboards from the Global Admin monitoring map.
- **MAXVitals Advanced Simulation Engine:** Generates flawless mathematical baseline simulations (SpO2 drops, tachycardia, and stress cycles) linked directly back to your physical hardware movements.
- **Priority Escalation Admin Portals:** Complete with clickable triage flagging, mathematical client-side pagination, real-time 'Time Since Active' algorithms, and dynamic list filtering.
- **Modern UI/UX:** Premium futuristic design featuring deep glassmorphism aesthetics and smooth ambient CSS motion energy orbs.

## 🛠️ Technology Stack
- **Frontend:** React 18, TypeScript, TailwindCSS, Chart.js, Vite, Lucide-React.
- **Backend:** Node.js, Express.js.
- **APIs & Protocols:** Socket.io (Bi-directional real-time events).
- **Database:** MongoDB (User queuing & node history authentication).
- **Hardware Integrations:** ESP32 NodeMCU, MAX30100 (Pulse Oximeter/Heart Rate), MPU6050 (Spatial Accelerometer/Gyroscope), SSD1306 (128x64 OLED Display), Active Buzzer.

## 🌩️ Deployment
The project architecture strictly decouples the client and server. The Node.js `backend/` must run actively via Express, while the `frontend/` utilizes standard Vite compilation parameters. 
*Note: Backend deployment strictly relies on a secured `.env` exposing your personal `MONGO_URI`.*

## ⚖️ License
© 2026 EmoSync Platform. Cryptographically signed and verified. All Rights Reserved.
