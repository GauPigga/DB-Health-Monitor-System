# 📊 Database Health Monitor and Report Generator

This project provides a complete dashboard and reporting system to monitor Oracle Database performance. Built for environments like HAL, where internet access is limited, it captures system metrics, alerts, session activity, slow queries, and more — visualized through a modern React dashboard and Flask backend.

---

## 🚀 Features

- 🔴 Real-time status of DB instance (uptime, open state)
- 🧠 Tracks active/idle/blocking sessions
- 💽 CPU and Memory usage metrics
- ⚠️ Recent DB alerts and warnings
- 📊 Query performance insights (avg exec time, CPU usage)
- 🗂 Tablespace utilization visualization
- 📚 Largest tables summary
- 👤 User activity analytics
- 📤 Export CSV from sections (planned: full PDF report)
- 🔌 100% offline — no internet required

---

## 🧰 Tech Stack

| Layer         | Technology            |
|--------------|------------------------|
| Frontend     | React, Tailwind CSS    |
| Backend      | Python (Flask)         |
| Database     | Oracle 21c             |
| Visualization| Chart.js (Line Graphs) |
| Reporting    | CSV Export (custom)    |

---

## ⚙️ Setup Instructions

### Step 1: Prerequisites

- Oracle Database (21c or XE version installed)
- Python 3.9+ and pip
- Node.js + npm
- oracledb (Oracle Python connector)
- Oracle Instant Client installed

### Step 2: Backend Setup

```bash
cd backend/
pip install -r requirements.txt
```

Update config.py with DB credentials.

Start backend server:

```bash
python app.py
```

### Step 3: Frontend Setup

```bash
cd frontend/
npm install
npm run dev
```

Access: http://localhost:5173

---

## 📌 How It Works

- Backend fetches from Oracle system views (v$session, v$sql, etc.)
- Sync scripts populate custom tables
- React frontend fetches and visualizes data
- CSV export per section
- PDF reporting & scheduled jobs using cron/task scheduler
---

## 📄 License

Educational/internship use at HAL. Free to use internally.
