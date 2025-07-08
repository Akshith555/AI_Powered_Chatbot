import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow CORS (adjust origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load FAQ
with open("faq.json", "r") as f:
    FAQ_LIST = json.load(f)

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: ChatRequest):
    user_message = request.question.strip().lower()
    # Try FAQ exact match first
    for faq in FAQ_LIST:
        if faq["question"].lower() == user_message:
            return {"answer": faq["answer"]}

    # No FAQ match: Ask OpenAI GPT-4o
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": user_message}],
            max_tokens=100
        )
        bot_reply = response.choices[0].message.content.strip()
        return {"answer": bot_reply}
    except Exception as e:
        return {"answer": "Sorry, I couldn't reach the AI service right now."}
