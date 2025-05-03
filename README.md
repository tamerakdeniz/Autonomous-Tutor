# Decentralized Tutor

A decentralized AI-powered learning platform built with FastAPI that provides personalized code analysis and tutoring. The system uses Google's Gemini AI to analyze code, provide feedback, and adapt to each user's learning pace while maintaining a decentralized approach to education.

## 🌟 Key Features

- **Decentralized Learning System**

  - Peer-to-peer knowledge sharing
  - Distributed feedback mechanisms
  - Community-driven content validation

- **AI-Powered Analysis**

  - Real-time code analysis
  - Personalized feedback generation
  - Adaptive difficulty scaling
  - Context-aware hint system

- **User Experience**
  - Secure authentication system
  - Progress tracking and analytics
  - Skill-based matchmaking
  - Interactive learning sessions

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tamerakdeniz/Decentralized-Tutor.git
cd Decentralized-Tutor
```

2. Create and activate virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL=sqlite:///./decentralized_tutor.db
SECRET_KEY=your-secure-secret-key
GEMINI_API_KEY=your-gemini-api-key  # Get this from Google AI Studio (https://makersuite.google.com/app/apikey)
```

To obtain your Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Create a new API key
4. Copy the API key and paste it in your `.env` file

5. Start the application:

```bash
uvicorn app.main:app --reload
```

Access the API at `http://localhost:8000/docs` for interactive documentation.

## 🔧 API Reference

### Authentication

| Endpoint        | Method | Description                |
| --------------- | ------ | -------------------------- |
| `/api/register` | POST   | Create new user account    |
| `/api/login`    | POST   | Authenticate and get token |

### Learning

| Endpoint                 | Method | Description                |
| ------------------------ | ------ | -------------------------- |
| `/api/analysis/generate` | GET    | Get new coding challenge   |
| `/api/analysis/submit`   | POST   | Submit solution for review |
| `/api/analysis/hint`     | GET    | Request contextual hint    |

### User Management

| Endpoint              | Method | Description            |
| --------------------- | ------ | ---------------------- |
| `/api/users/me`       | GET    | Get user profile       |
| `/api/users/progress` | GET    | View learning progress |
| `/api/users/settings` | PATCH  | Update preferences     |

## 📁 Project Structure

```
app/
├── main.py                 # Application entry point
├── database/              # Database configuration
│   └── database.py        # SQLAlchemy setup
├── models/               # Data models
│   ├── user.py           # User model
│   └── code_analysis.py  # Analysis model
├── routers/              # API endpoints
│   ├── auth.py          # Authentication routes
│   ├── users.py         # User management
│   └── code_analysis.py # Analysis routes
└── utils/               # Utility functions
    ├── code_analyzer.py # Code analysis engine
    └── feedback_generator.py # AI feedback system
```

## 🛠️ Technologies

- **Backend Framework:** FastAPI
- **Database:** SQLAlchemy with SQLite
- **AI Integration:** Google Gemini
- **Authentication:** JWT tokens
- **Testing:** Pytest

## 🤝 Contributing

We welcome contributions! This project was created during the Academy of Artificial Intelligence and Technology hackathon (appjam).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Academy of Artificial Intelligence and Technology
- Google for Gemini AI capabilities
- FastAPI community
- All contributors and participants of the hackathon
