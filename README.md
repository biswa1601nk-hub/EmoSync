# EmoSync
**A high-fidelity IoT wearable platform blending real-time ESP32/MPU6050 hardware telemetry, WebSocket streaming, and a React-powered medical dashboard with live 3D spatial tracking and biometric simulation.**

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=EmoSync+Dashboard)

## Key Features
* **Hardware Integration:** ESP32 local-network HTTP telemetry bypassing Bluetooth communication constraints.
* **3D Spatial Engine:** Real-time CSS matrix mapping of physical MPU6050 accelerometer orientations.
* **Live WebSockets:** Bi-directional NodeJS event streaming separating Admin overview maps from individual user node dashboards.
* **Med-Sim Engine:** Advanced localized mathematical simulation replicating physiological responses (SpO2 fluctuations, stress peaks) tied strictly to tracked hardware statuses.
* **Dynamic UI Architecture:** Complete with client-side pagination, database history queuing, React Router authentication, and responsive CSS motion graphics.

## Tech Stack
* **Frontend:** React, TypeScript, TailwindCSS, Chart.js, Vite
* **Backend:** NodeJS, Express.js, Socket.io
* **Database:** MongoDB
* **Hardware:** ESP32 (WiFi HTTP WebServer), MPU6050
