from typing import Any, Dict, Optional

import google.generativeai as genai

from app.utils.code_analyzer import generate_feedback_prompt
from config.settings import get_settings

settings = get_settings()

class FeedbackGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
    async def generate_feedback(
        self,
        code: str,
        user_answer: str,
        question_type: str,
        skill_level: str,
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """Generate feedback for user's code analysis using Gemini"""
        prompt = generate_feedback_prompt(code, user_answer, question_type, skill_level)
        
        for attempt in range(max_retries):
            try:
                response = await self._call_llm(prompt)
                return {
                    "feedback": response,
                    "success": True
                }
            except Exception as e:
                if attempt == max_retries - 1:
                    return {
                        "feedback": "I apologize, but I'm having trouble generating feedback right now. Please try again later.",
                        "success": False,
                        "error": str(e)
                    }
    
    async def _call_llm(self, prompt: str) -> str:
        """Make the actual API call to Gemini"""
        try:
            # Create a chat session with system prompt
            chat = self.model.start_chat(history=[])
            
            # Send the prompt and get response
            response = chat.send_message(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error calling Gemini API: {str(e)}")
            
    async def generate_hint(
        self,
        code: str,
        question_type: str,
        skill_level: str,
        previous_hints: Optional[list] = None
    ) -> str:
        """Generate a hint for the current code analysis question"""
        previous_hints = previous_hints or []
        
        hint_prompt = f"""Given this code:
```python
{code}
```

The student is at {skill_level} level and working on {question_type}.
They have already received these hints: {', '.join(previous_hints) if previous_hints else 'no hints yet'}

Provide a subtle hint that:
1. Doesn't give away the answer
2. Guides them to think about the right concepts
3. Builds on previous hints if any
4. Is appropriate for their skill level

Keep the hint concise and encouraging."""

        try:
            chat = self.model.start_chat(history=[])
            response = chat.send_message(hint_prompt)
            return response.text
        except Exception as e:
            return "I'm having trouble generating a hint right now. Try reviewing the code step by step."

async def generate_feedback(code: str, analysis_results: Dict[str, Any]) -> str:
    """Generate feedback using Google's Gemini AI model.
    
    Args:
        code: The code to analyze
        analysis_results: Results from static code analysis
        
    Returns:
        str: Feedback about the code
    """
    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # Prepare the prompt
        prompt = f"""
        As a programming tutor, analyze this code and provide constructive feedback.
        Pay attention to:
        1. Code quality and best practices
        2. Potential improvements
        3. Security concerns
        4. Performance considerations

        Code to analyze:
        ```
        {code}
        ```

        Static analysis results:
        {analysis_results}
        """

        response = model.generate_content(prompt)
        if response.parts:
            return response.text
        return "Unable to generate feedback. Please try again."

    except Exception as e:
        print(f"Error generating feedback: {str(e)}")
        return "An error occurred while generating feedback. Please try again later."