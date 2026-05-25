# AI-Driven Personal Finance Manager & Fraud Detection Dashboard

## 🚀 Project Overview
**AuraShield** is an advanced intelligent personal financial tracking platform built to secure user transactions against systemic frauds. By utilizing non-intrusive behavioral telemetry alongside financial logic engines, it provides continuous asset protection and immediate system isolation during threat detection.

## 🛠️ Architecture & Tech Stack
- **Frontend:** React.js (Vite) + Recharts for responsive telemetry graphs.
- **Backend:** FastAPI (Python) for asynchronous, high-concurrency request handling.
- **Machine Learning Engine:** Scikit-Learn (Isolation Forest Model).
  - *Logic:* The Isolation Forest isolates anomalous tracking metrics through random partitioning. Rapidly isolated points identify user "cognitive drift" or transaction stress, triggering defensive masking protocols.

## 🛡️ Core Innovation Features
1. **Continuous Telemetry Tracking:** Client-side metric evaluation to recognize erratic navigation signatures.
2. **Cognitive Shield Mode:** Instantly masks active ledger data (`[REDACTED_BY_COGNITIVE_SHIELD]`) upon systemic risk verification to enforce zero-trust privacy.
3. **Ethical AI Integration:** Incorporates a built-in Audit Engine allowing transparent system state logging without saving user PII data.

## ⚙️ Installation and Setup

### 1. Running the Backend
```bash
cd backend
pip install -r requirements.txt
python main.py