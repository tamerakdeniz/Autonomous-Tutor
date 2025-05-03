import google.generativeai as genai

from config.settings import get_settings

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)

def analyze_code(code: str) -> str:
    """Analyze code using Google's Gemini model"""
    prompt = f"""Analyze this code and provide:
    1. Code quality assessment
    2. Potential improvements
    3. Best practices suggestions
    4. Security considerations
    
    Code to analyze:
    ```
    {code}
    ```
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error analyzing code: {str(e)}"