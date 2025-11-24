
## 🚀 How to Run the Project

### 🟦 1. Run the Backend (FastAPI)

```bash
# Step 1: Go to backend folder
cd backend

# Step 2: Create and activate virtual environment

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

🟩 2. Run the Frontend (Next.js)

```bash
# Step 1: Go to frontend folder
cd frontend

# Step 2: Install dependencies (only needed the first time)
npm install

# Step 3: Start the development server
npm run dev
```