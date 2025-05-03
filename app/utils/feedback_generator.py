import google.generativeai as genai

from config.settings import get_settings

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)

def generate_learning_feedback(code: str, analysis_result: str) -> str:
    """Generate personalized learning feedback based on code analysis"""
    prompt = f"""Based on this code and its analysis, provide personalized learning feedback:
    
    Code:
    ```
    {code}
    ```
    
    Analysis:
    {analysis_result}
    
    Please provide:
    1. Specific concepts the learner should focus on
    2. Learning resources and documentation links
    3. Practice exercises to improve
    4. Common pitfalls to avoid
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating feedback: {str(e)}"