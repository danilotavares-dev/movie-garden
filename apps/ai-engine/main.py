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

    context = f'Pedido do usuário: "{data.movie_title}". Preferências adicionais: "{data.user_preferences}".'
    goal = "Recomende exatamente 9 filmes ou séries que atendam ao pedido."

    prompt = f"""
    Você é um especialista em cinema e séries, responsável por uma busca de catálogo.
    {context}
    {goal}

    Interprete linguagem natural, inclusive gênero, humor, época, duração,
    idioma, plataforma, atores, diretores e pedidos como "algo parecido com...".
    Priorize títulos conhecidos e realmente existentes. Não invente títulos.
    Misture filmes e séries quando isso fizer sentido. Responda os motivos em português.
    Não inclua introdução, markdown ou texto fora do JSON.
    Responda APENAS com um array JSON válido, estritamente neste formato:
    [
      {{ "title": "Título original ou mais conhecido", "mediaType": "movie", "reason": "Motivo curto em português" }},
      ...
    ]
    """

    try:
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
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