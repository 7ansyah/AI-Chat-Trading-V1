from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from ai_engine import handle_user_message, handle_image_upload, developer_analysis
from memory import set_ai_status

app = FastAPI()

# Static file mounting
app.mount("/", StaticFiles(directory="../", html=True), name="static")

# CORS untuk akses dari browser lokal
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint kirim pesan teks
@app.post("/api/message")
async def api_message(request: Request):
    data = await request.json()
    user_text = data.get("text", "")
    replies = handle_user_message(user_text)
    return JSONResponse(content={"replies": replies})

# Endpoint kirim gambar
@app.post("/api/image")
async def api_image(image: UploadFile = File(...)):
    replies = handle_image_upload(image)
    return JSONResponse(content={"replies": replies})

# Endpoint kontrol (Mulai/Pause)
@app.post("/api/control")
async def api_control(request: Request):
    data = await request.json()
    action = data.get("action", "")
    if action in ["start", "pause"]:
        set_ai_status(action)
        return {"status": f"AI telah {action}"}
    return {"error": "Aksi tidak dikenali"}

# Endpoint evaluasi Developer
@app.get("/api/developer")
async def api_developer():
    replies = developer_analysis()
    return JSONResponse(content={"replies": replies})

# Jalankan server (opsional untuk lokal)
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
