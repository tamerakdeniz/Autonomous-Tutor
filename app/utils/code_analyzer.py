import ast
import re
from typing import Any, Dict, List, Optional


def analyze_python_code(code: str) -> Dict[str, Any]:
    """Analyze Python code for potential issues and patterns"""
    try:
        tree = ast.parse(code)
        analysis = {
            "valid_syntax": True,
            "features": [],
            "complexity": "low",
            "suggestions": []
        }
        
        # Check for common patterns
        for node in ast.walk(tree):
            if isinstance(node, ast.For):
                analysis["features"].append("loop")
            elif isinstance(node, ast.If):
                analysis["features"].append("conditional")
            elif isinstance(node, ast.FunctionDef):
                analysis["features"].append("function")
            elif isinstance(node, ast.ClassDef):
                analysis["features"].append("class")
                
        # Remove duplicates
        analysis["features"] = list(set(analysis["features"]))
        
        # Basic complexity analysis
        if len(analysis["features"]) > 2:
            analysis["complexity"] = "medium"
        if len(analysis["features"]) > 4:
            analysis["complexity"] = "high"
            
        return analysis
    except SyntaxError as e:
        return {
            "valid_syntax": False,
            "error": str(e),
            "line": e.lineno,
            "offset": e.offset,
            "features": [],
            "complexity": "unknown"
        }

def generate_feedback_prompt(code: str, user_answer: str, question_type: str, skill_level: str) -> str:
    """Generate a structured prompt for the LLM to provide feedback"""
    base_prompt = f"""You are an experienced programming tutor helping a {skill_level} level student.
Review their analysis of the following code and provide constructive feedback.
Focus on teaching concepts and guiding them to understand {'errors' if question_type == 'incorrect_analysis' else 'patterns'}.

Code being analyzed:
```python
{code}
```

Student's analysis:
{user_answer}

Question type: {question_type}

Provide feedback that:
1. Acknowledges what they got right
2. Gently points out any misconceptions
3. Asks guiding questions to help them discover the {'error' if question_type == 'incorrect_analysis' else 'concepts'} themselves
4. Provides hints without giving away the answer directly

Remember to be encouraging and supportive while maintaining academic rigor."""
    
    return base_prompt

def evaluate_answer_accuracy(user_answer: str, code_analysis: Dict[str, Any], question_type: str) -> float:
    """Evaluate the accuracy of a user's answer based on code analysis"""
    if question_type == "incorrect_analysis":
        # Check if user identified syntax errors
        if not code_analysis["valid_syntax"]:
            return 1.0 if "syntax" in user_answer.lower() else 0.0
    
    # For correct analysis questions, check if user identified key features
    feature_count = 0
    total_features = len(code_analysis["features"])
    
    if total_features == 0:
        return 1.0  # No features to identify
        
    for feature in code_analysis["features"]:
        if feature in user_answer.lower():
            feature_count += 1
    
    return feature_count / total_features

def get_next_question_difficulty(current_performance: List[bool], current_level: str) -> str:
    """Determine if user should move to a different difficulty level"""
    if len(current_performance) < 5:
        return current_level
        
    recent_performance = current_performance[-5:]
    success_rate = sum(1 for x in recent_performance if x) / len(recent_performance)
    
    if success_rate > 0.8 and current_level == "beginner":
        return "intermediate"
    elif success_rate > 0.8 and current_level == "intermediate":
        return "advanced"
    elif success_rate < 0.4 and current_level == "advanced":
        return "intermediate"
    elif success_rate < 0.4 and current_level == "intermediate":
        return "beginner"
        
    return current_level