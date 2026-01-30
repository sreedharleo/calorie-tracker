# AI Calorie Tracker

A modern, mobile-first calorie tracking application that uses AI to estimate calories from food images. Built with React, Tailwind CSS, and FastAPI.

![App Screenshot](https://via.placeholder.com/800x400?text=Calorie+Tracker+App)

## Features

- **User Authentication**: Secure Signup and Login (JWT).
- **Personalized Targets**: Calculates BMR and daily calorie goals based on age, weight, height, and activity level.
- **Food Logging**: 
    - Capture or upload food images.
    - AI-assisted food detection (Mock integration ready for generic food API).
    - Portion size adjustment.
- **Dashboard**: Real-time progress tracking and daily history.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Python FastAPI, SQLAlchemy
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/calorie-tracker.git
   cd calorie-tracker
   ```

2. **Backend Setup**
   ```bash
   cd server
   # Create virtual environment
   python -m venv venv
   
   # Activate venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   # source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start the Backend** (from `server/` directory)
   ```bash
   # Ensure venv is active
   uvicorn main:app --reload
   ```
   Server runs at `http://localhost:8000`.

2. **Start the Frontend** (from `client/` directory)
   ```bash
   npm run devd
   ```ac 
   App runs at `http://localhost:5173`.

## Deployment

- **Frontend**: Build using `npm run build` and deploy to Vercel/Netlify.
- **Backend**: Deploy `server/` to Render/Railway/Heroku.

## License

MIT
"# calorie-tracker" 
