# 🛡️ CSC&E Output Validator

**Cyber Security Culture & Enablement — Output Governance Platform**

> AI-powered validation platform that replaces Excel-based outcome tracking with structured, quality-controlled output management.

---

## 🏗️ Architecture

```
┌──────────────────────────────────┐
│  Frontend (HTML/CSS/JS)          │
│  Tailwind CSS + Custom Design    │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  Backend (FastAPI + Python)      │
│  REST API + Static Files         │
└──────────────┬───────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  SQLite DB  │  │ myGenAssist │
│  (Storage)  │  │ (AI / LLM)  │
└─────────────┘  └─────────────┘
       │
┌──────▼──────┐
│  Power BI   │
│  (Analytics)│
└─────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Validation** | Validates outputs against CSC&E strategic outcomes using LLM |
| 👥 **Multi-Team** | Squad-based filtering (replaces Excel tabs) |
| 📝 **Full CRUD** | Create, edit, delete outputs with structured forms |
| 📊 **Stats Dashboard** | Total outputs, validation rate, quality metrics |
| 🎯 **Outcome Alignment** | Maps outputs to CSF/CSCE outcomes automatically |
| 📥 **Excel Import** | Import existing data from Outcome Tracking spreadsheet |
| 📤 **CSV Export** | Export data for Power BI integration |
| 🔍 **Search** | Filter outputs across all fields |
| 🏷️ **Status Badges** | Color-coded AI validation (Valid/Improve/Reject) |
| 🔄 **Fallback Mode** | Rule-based validation when AI is unavailable |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-ORG/csce-output-validator.git
cd csce-output-validator
```

### 2. Create virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
pip install openpyxl   # for Excel import
```

### 4. Configure environment

```bash
copy .env.example .env
```

Edit `.env` with your credentials:

```ini
MYGENASSIST_TOKEN=your-token-here
MYGENASSIST_URL=https://chat.int.bayer.com/api/v2
MYGENASSIST_MODEL=claude-sonnet-4.6-azure
```

### 5. Configure proxy (if required)

```bash
set HTTPS_PROXY=http://163.116.128.80:80
set HTTP_PROXY=http://163.116.128.80:80
```

### 6. Run the application

```bash
uvicorn app.main:app --reload --port 8000
```

### 7. Open in browser

```
http://localhost:8000
```

---

## 📁 Project Structure

```
csce-output-validator/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application & routes
│   ├── database.py          # SQLite database & CRUD
│   ├── seed.py              # Reference data (squads, outcomes, countries)
│   ├── validator.py         # myGenAssist AI integration + fallback
│   └── prompt.py            # CSC&E validation prompt (optimized)
├── static/
│   ├── index.html           # Main UI (single-page app)
│   ├── app.js               # Frontend logic (vanilla JS)
│   └── style.css            # Custom styles (dark sidebar, cards)
├── import_excel.py          # Excel data import script
├── import_data.bat          # Windows import launcher
├── .env.example             # Environment template
├── .gitignore
├── requirements.txt
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 👥 Multi-Team Support

Teams (Squads) replace Excel tabs:

| Squad | Region | Description |
|-------|--------|-------------|
| Platform Excellence | Global | Global platform team |
| Human Centric Cyber Security | Global | Human-centric security |
| Living Security at Bayer | Global | Living Security program |
| CSO - Greater China | China | China CSO team |
| CSO - Americas | Americas | Americas CSO team |
| CSO - EMEA | EMEA | EMEA CSO team |
| CSO - APAC | APAC | APAC CSO team |

Each user selects their squad → sees only their outputs.

---

## 🤖 AI Validation

The **"Validate Output"** button checks each output against 4 criteria:

### 1. Output Quality (Critical)
- Must be a **concrete deliverable** (not an activity)
- "Prepare slides" → ❌ Reject
- "Deploy Cyber Risk Dashboard" → ✅ Valid

### 2. Outcome Alignment
Maps to CSC&E outcomes: Culture, Talent & Platform Excellence, License to Operate, Security-by-Design, Stakeholder Engagement, CSF Capability Delivery & Footprint

### 3. Business Value
Must contribute to: risk reduction, compliance, awareness, capability improvement, or decision support

### 4. Measurability
Checks if Measure and Impact fields are well-defined

### Result
Returns structured JSON:
```json
{
  "status": "Valid | Improve | Reject",
  "alignment": "Aligned | Weak | Not aligned",
  "outcome": "Culture | Talent & Platform Excellence | ...",
  "business_value": "High | Medium | Low",
  "comment": "Short explanation",
  "suggestion": "Rewritten version (if needed)"
}
```

---

## 📥 Import from Excel

Import existing data from your Outcome Tracking spreadsheet:

```bash
python import_excel.py "Outcome Tracking Automated 2.0.xlsx"
```

The script automatically:
- Maps each Excel tab to the correct squad
- Maps all columns to database fields
- Skips empty rows and reference sheets
- Handles missing/invalid values

---

## 📊 Power BI Integration

Export data as CSV for Power BI:
- Click **"Export CSV"** in the sidebar
- Or access: `http://localhost:8000/api/export`

RAG calculation (done in Power BI):
- 🟢 Green ≥ 90%
- 🟡 Yellow 70-89%
- 🔴 Red < 70%

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript, Tailwind CSS |
| **Backend** | Python 3.11+, FastAPI, Uvicorn |
| **Database** | SQLite (WAL mode) |
| **AI** | myGenAssist API (Claude Sonnet) |
| **Export** | CSV (Power BI compatible) |
| **Deploy** | Docker / Local / Azure App Service |

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

---

## 📄 License

Internal use — Cyber Security Culture & Enablement Platform

---

**Built with ❤️ for CSC&E**
