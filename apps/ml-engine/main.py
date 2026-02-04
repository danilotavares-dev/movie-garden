import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("A chave GEMINI_API_KEY não foi encontrada no arquivo .env!")

genai.configure(api_key=api_key)

model = genai.GenerativeModel('models/gemini-2.5-flash')

app = FastAPI(title="Movie Garden ML (Gemini Safe)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MovieRequest(BaseModel):
    movie_title: str
    user_preferences: str = ""

@app.get("/")
def health_check():
    return {"status": "online", "engine": "Google Gemini"}

@app.post("/recommend")
async def get_recommendations(data: MovieRequest):
    print(f"🤖 Perguntando ao Gemini sobre: {data.movie_title}")

    if data.movie_title:
        context = f'O usuário gostou do filme: "{data.movie_title}". Preferências: "{data.user_preferences}".'
        goal = "Recomende 3 filmes similares."
    else:
        context = f'O usuário quer descobrir filmes sobre o tema: "{data.user_preferences}".'
        goal = "Recomende 5 filmes aclamados e populares desse tema."

    prompt = f"""
    Atue como um especialista em cinema.
    {context}
    {goal}
    
    IMPORTANTE: Responda APENAS com um JSON válido, estritamente neste formato:
    [
      {{ "title": "Nome do Filme em Inglês (Original)", "reason": "Motivo curto em português" }},
      ...
    ]
    """

    try:
        response = model.generate_content(prompt)

        raw_text = response.text

        cleaned_text = raw_text.replace("```json", "").replace("```", "").strip()

        recommendations = json.loads(cleaned_text)

        return {"data": recommendations}

    except Exception as e:
        print(f"Erro no Gemini: {e}")
        raise HTTPException(status_code=500, detail=str(e))