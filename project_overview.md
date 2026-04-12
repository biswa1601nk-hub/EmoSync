# Human Emotion Detection System & DesignPro 

I have created the full-fledged Vite + React MERN stack project as you requested. It covers both the **Emotion Monitoring System** and the beautiful **DesignPro Landing Page**.

## 🏗️ Project Architecture
The project is running on your machine natively right now with the following structure:
- **`frontend/`**: The React + TypeScript + Vite project housing the UI.
- **`backend/`**: The Express + Socket.io server generating real-time hardware data.

## 📍 Key Routes Established:
1. **Landing Page (`/`)**: 
   - A full-screen video background matching the required Cloudfront URL.
   - Animated `ShinyText` with Framer Motion. 
   - Uses Lucide React icons, dark aesthetics, and glassmorphic UI nav menus as specified.
   - Text exactly matches: "We deliver transformative programs...", "Become Product Leader", etc.
2. **Login Page (`/login`)**:
   - Role-based selection between `User` and `Admin`.
3. **User Dashboard (`/dashboard`)**:
   - Live Gauge reflecting stress level.
   - Interactive trend Line chart rendering real-time history through `chart.js` and `socket.io`.
   - Notifications log displaying alerts.
4. **Admin Dashboard (`/admin`)**:
   - Real-time tabular tracking of multiple connected users.
   - Priority Critical Alerts section rendering red pulsing indicators for users with >80% stress.
   - Mock integration to forward critical alerts to authorities.
