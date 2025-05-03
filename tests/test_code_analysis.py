import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.utils.code_analyzer import analyze_code
from app.utils.feedback_generator import generate_learning_feedback

client = TestClient(app)

def test_analyze_code():
    """Test code analysis endpoint"""
    test_code = """
    def add(a, b):
        return a + b
    """
    
    response = client.post("/api/analyze", json={"code": test_code})
    assert response.status_code == 200
    assert "analysis" in response.json()
    assert "feedback" in response.json()
    assert "id" in response.json()

def test_code_analyzer_utility():
    """Test code analyzer utility function"""
    test_code = """
    def add(a, b):
        return a + b
    """
    
    result = analyze_code(test_code)
    assert isinstance(result, str)
    assert len(result) > 0

def test_feedback_generator_utility():
    """Test feedback generator utility function"""
    test_code = """
    def add(a, b):
        return a + b
    """
    analysis = "Code is simple and functional."
    
    result = generate_learning_feedback(test_code, analysis)
    assert isinstance(result, str)
    assert len(result) > 0