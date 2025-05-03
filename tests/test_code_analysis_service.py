from unittest.mock import Mock, patch

import pytest
from sqlalchemy.orm import Session

from app.models.code_analysis import CodeAnalysis
from app.services.code_analysis_service import CodeAnalysisService


@pytest.fixture
def mock_db():
    return Mock(spec=Session)

@pytest.fixture
def code_analysis_service(mock_db):
    return CodeAnalysisService(mock_db)

def test_create_analysis(code_analysis_service, mock_db):
    # Arrange
    test_code = "def add(a, b): return a + b"
    mock_analysis = "Test analysis result"
    mock_feedback = "Test feedback"
    
    with patch('app.utils.code_analyzer.analyze_code', return_value=mock_analysis), \
         patch('app.utils.feedback_generator.generate_learning_feedback', return_value=mock_feedback):
        
        # Act
        result = code_analysis_service.create_analysis(test_code)
        
        # Assert
        assert isinstance(result, CodeAnalysis)
        assert result.code == test_code
        assert result.analysis == mock_analysis
        assert result.feedback == mock_feedback
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once()

def test_get_analysis_by_id(code_analysis_service, mock_db):
    # Arrange
    mock_analysis = Mock(spec=CodeAnalysis)
    mock_db.query.return_value.filter.return_value.first.return_value = mock_analysis
    
    # Act
    result = code_analysis_service.get_analysis_by_id(1)
    
    # Assert
    assert result == mock_analysis
    mock_db.query.assert_called_once_with(CodeAnalysis)

def test_get_recent_analyses(code_analysis_service, mock_db):
    # Arrange
    mock_analyses = [Mock(spec=CodeAnalysis) for _ in range(3)]
    mock_db.query.return_value.order_by.return_value.limit.return_value.all.return_value = mock_analyses
    
    # Act
    result = code_analysis_service.get_recent_analyses(limit=3)
    
    # Assert
    assert result == mock_analyses
    assert len(result) == 3
    mock_db.query.assert_called_once_with(CodeAnalysis)

def test_delete_analysis_success(code_analysis_service, mock_db):
    # Arrange
    mock_analysis = Mock(spec=CodeAnalysis)
    mock_db.query.return_value.filter.return_value.first.return_value = mock_analysis
    
    # Act
    result = code_analysis_service.delete_analysis(1)
    
    # Assert
    assert result is True
    mock_db.delete.assert_called_once_with(mock_analysis)
    mock_db.commit.assert_called_once()

def test_delete_analysis_not_found(code_analysis_service, mock_db):
    # Arrange
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    # Act
    result = code_analysis_service.delete_analysis(1)
    
    # Assert
    assert result is False
    mock_db.delete.assert_not_called()
    mock_db.commit.assert_not_called()