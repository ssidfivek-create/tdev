# 🚀 Render Test Application

A dummy Flask application for testing deployments on Render.com.

## Features

- ✅ Health check endpoint
- ✅ Server information display
- ✅ Message echo API
- ✅ Simple calculator
- ✅ Real-time status updates
- ✅ Responsive design
- ✅ API response viewer

## Live Demo

Deployed on Render: [https://render-test-app.onrender.com](https://render-test-app.onrender.com)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application UI |
| `/api/health` | GET | Health check |
| `/api/server-info` | GET | Server environment info |
| `/api/echo` | POST | Echo back messages |
| `/api/messages` | GET | Get recent messages |
| `/api/generate-data` | GET | Generate dummy data |
| `/api/calculate` | POST | Perform calculations |

## Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Or manually:

1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `render-test-app`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
6. Click "Create Web Service"

## Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/render-test-app.git
cd render-test-app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py

# Visit http://localhost:5000
