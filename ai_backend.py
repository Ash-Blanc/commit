from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json

app = Flask(__name__)
CORS(app)

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyAJGS_LPzhwQA0VzEHd-Or7o5fXQd0aLBI')

@app.route('/api/ai/generate-ideas', methods=['POST'])
def generate_essay_ideas():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        profile = data.get('profile', {})
        
        # Create a system message for essay idea generation
        system_message = f"""You are an expert college admissions counselor helping students brainstorm essay ideas. 
        Student profile: {json.dumps(profile)}
        Generate 3-5 creative, authentic essay ideas that would help this student stand out.
        Return as JSON with format: {{"ideas": [{{"title": "...", "description": "...", "why_compelling": "..."}}]}}"""
        
        # Initialize Gemini chat
        chat = LlmChat(
            api_key=GEMINI_API_KEY,
            session_id=f"essay-ideas-{hash(prompt)}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Create user message
        user_message = UserMessage(
            text=f"Essay prompt: {prompt}. Please generate essay ideas for this student."
        )
        
        # Get response
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(chat.send_message(user_message))
        loop.close()
        
        return jsonify({"success": True, "response": response})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ai/generate-outline', methods=['POST'])
def generate_essay_outline():
    try:
        data = request.json
        topic = data.get('topic', '')
        prompt = data.get('prompt', '')
        profile = data.get('profile', {})
        
        system_message = f"""You are an expert essay writing coach. Create a detailed outline for a college essay.
        Student profile: {json.dumps(profile)}
        Return as JSON with format: {{
            "hook": {{"content": "..."}},
            "introduction": {{"content": "..."}},
            "body_paragraphs": [{{"content": "..."}}],
            "conclusion": {{"content": "..."}}
        }}"""
        
        chat = LlmChat(
            api_key=GEMINI_API_KEY,
            session_id=f"essay-outline-{hash(topic + prompt)}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        user_message = UserMessage(
            text=f"Topic: {topic}\nPrompt: {prompt}\nCreate a detailed essay outline."
        )
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(chat.send_message(user_message))
        loop.close()
        
        return jsonify({"success": True, "response": response})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ai/get-feedback', methods=['POST'])
def get_essay_feedback():
    try:
        data = request.json
        content = data.get('content', '')
        
        system_message = """You are an expert college admissions counselor providing feedback on essays.
        Analyze the essay and provide detailed feedback.
        Return as JSON with format: {
            "overall_score": 85,
            "strengths": ["..."],
            "suggestions": ["..."],
            "grammar_issues": ["..."],
            "authenticity_notes": ["..."]
        }"""
        
        chat = LlmChat(
            api_key=GEMINI_API_KEY,
            session_id=f"essay-feedback-{hash(content[:100])}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        user_message = UserMessage(
            text=f"Please analyze this college essay and provide detailed feedback:\n\n{content}"
        )
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(chat.send_message(user_message))
        loop.close()
        
        return jsonify({"success": True, "response": response})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ai/college-recommendations', methods=['POST'])
def get_college_recommendations():
    try:
        data = request.json
        profile = data.get('profile', {})
        preferences = data.get('preferences', {})
        
        system_message = """You are a college counselor providing personalized college recommendations.
        Analyze the student profile and preferences to suggest suitable colleges.
        Return as JSON with format: {
            "recommendations": [{
                "name": "...",
                "match_percentage": 85,
                "reasons": ["..."],
                "category": "reach|match|safety"
            }]
        }"""
        
        chat = LlmChat(
            api_key=GEMINI_API_KEY,
            session_id=f"college-rec-{hash(str(profile))}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        user_message = UserMessage(
            text=f"Student profile: {json.dumps(profile)}\nPreferences: {json.dumps(preferences)}\nProvide college recommendations."
        )
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(chat.send_message(user_message))
        loop.close()
        
        return jsonify({"success": True, "response": response})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)