# 🌐 API-Dashboard
> **Next-Gen Microservices Observability Platform**


[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Kotlin](https://img.shields.io/badge/Kotlin-1.9-purple?style=for-the-badge&logo=kotlin)](https://kotlinlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-Fiber-black?style=for-the-badge&logo=three.js)](https://docs.pmnd.rs/react-three-fiber)

---

## ⚡ Overview

**Nexus Dashboard** is a high-performance observability tool designed to visualize, monitor, and stress-test microservices architectures in real-time. 

Built with a **Spring Boot (Kotlin)** backend for robust data ingestion and a **Next.js** frontend for a premium, interactive experience, it features a stunning **3D Network Topology** graph that brings your infrastructure to life.

## ✨ Key Features

### 🔍 Interactive 3D Topology
Visualize your entire service mesh as a living, breathing 3D network.
- **Real-time Traffic**: Pulse animations show data flowing between services.
- **Health States**: Nodes change color dynamically based on health status (Healthy, Latency Warning, Error Critical).
- **Interactive**: Zoom, pan, and rotate to inspect connections.

### 🕹️ Traffic Simulator
Built-in chaos engineering tool to test your system's resilience.
- **Load Generation**: Simulate organic traffic spikes.
- **Chaos Scenarios**: Inject "Latency Spikes" or "Error Bursts" to see how the dashboard reacts.

### 📊 Real-Time Analytics
- **Live Metrics**: Log ingestion via REST API with sub-second dashboard updates.
- **Bot/Scraper Protection**: Intelligent pattern detection.
- **Top Slow Endpoints**: Automatically identifies performance bottlenecks.

### 🚨 Smart Alerts
- **Incident Center**: Auto-grouping of anomalies into incidents.
- **Resolution Workflow**: Mark incidents as resolved directly from the UI.

---

## 🛠️ Architecture

### Frontend (`/frontend`)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Animations
- **Visualization**: React Three Fiber (3D), Recharts (2D)
- **State**: React Hooks + Polling

### Backend (`/backend/collector-service`)
- **Language**: Kotlin
- **Framework**: Spring Boot 3
- **Database**: MongoDB (Reactive Streams)
- **Architecture**: Controller -> Service -> Repository (DTO Pattern)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- JDK 17+
- MongoDB Local or Atlas Connection String

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/nexus-dashboard.git
cd nexus-dashboard
```

### 2. Start the Backend
```bash
cd backend
./gradlew :collector-service:bootRun
```
*The server will start on `PORT 8080`.*

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:3000`.*

---

## ☁️ Deployment

We support cloud-native deployment out of the box.

- **Frontend**: Deploy provided `frontend` folder to **Vercel** or **Netlify**.
- **Backend**: Deploy `backend/collector-service` to **Railway**, **Render**, or **AWS**.

> **Note**: Checks `lib/config.ts` and `application.properties` for environment variable overrides (`NEXT_PUBLIC_API_URL`, `SPRING_DATA_MONGODB_URI`).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.

## 📄 License

MIT © 2024 Sanidhya Kumar Singh(ssanidhya0407)
