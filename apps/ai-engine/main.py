import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import uvicorn

load_dotenv(Path(__file__).with_name(".env"), override=True)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("A chave GEMINI_API_KEY não foi encontrada no arquivo .env!")

client = genai.Client(api_key=api_key)
gemini_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

app = FastAPI(title="Movie Garden ML (Gemini Safe)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3333").split(",")
        if origin.strip()
    ],
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
    print(f"🤖 Buscando recomendações para: {data.movie_title}")

    prompt = f"""
Você é um especialista em cinema e séries. Recomende exatamente 9 títulos reais
para este pedido: "{data.movie_title}".
Preferências: "{data.user_preferences}".
Considere gênero, humor, época, duração, idioma, plataforma, atores e diretores.
Responda os motivos em português e misture filmes e séries quando fizer sentido.
Responda apenas um array JSON válido, sem markdown ou texto adicional:
[{{"title":"Título","mediaType":"movie","reason":"Motivo curto"}}]
"""

    try:
        response = await client.aio.models.generate_content(
            model=gemini_model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "max_output_tokens": 1200,
                "temperature": 0.4,
            },
        )

        raw_text = response.text

        cleaned_text = raw_text.replace("```json", "").replace("```", "").strip()

        recommendations = json.loads(cleaned_text)

        return {"data": recommendations}

    except Exception as e:
        print(f"Erro no Gemini: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )