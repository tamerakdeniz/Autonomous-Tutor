# Decentralized Tutor

A FastAPI-based application that helps users learn and improve their code analysis skills through interactive exercises and AI-powered feedback.

## Features

- User authentication and session management
- Progressive learning system with difficulty levels (beginner, intermediate, advanced)
- Different types of code analysis exercises:
  - Incorrect code analysis (find the bugs)
  - Correct code analysis (understand patterns and concepts)
  - Multiple choice questions (coming soon)
- AI-powered feedback using OpenAI's GPT models
- Progress tracking and skill level adaptation
- Hint system for when users need help

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   Create a `.env` file in the root directory with:

```
DATABASE_URL=sqlite:///./decentralized_tutor.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

4. Run the application:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get access token

### User Management

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me/skill-level` - Update skill level
- `GET /api/users/me/history` - Get learning history

### Code Analysis

- `GET /api/analysis/generate-question` - Get a new question
- `POST /api/analysis/submit-answer` - Submit and evaluate an answer
- `GET /api/analysis/hint` - Get a hint for the current question

## Development

### Running Tests

```bash
pytest tests/
```

### Project Structure

```
app/
├── main.py           # FastAPI application entry point
├── database/         # Database configurations
├── models/          # SQLAlchemy models
├── routers/         # API route handlers
└── utils/           # Utility functions
    ├── code_analyzer.py     # Code analysis logic
    └── feedback_generator.py # AI feedback generation
```

## Technologies Used

- FastAPI - Web framework
- SQLAlchemy - Database ORM
- OpenAI GPT - AI feedback generation
- PyJWT - Authentication
- Pytest - Testing

## Contributing

This project was created during the Academy of Artificial Intelligence and Technology hackathon (appjam). Feel free to contribute by:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
