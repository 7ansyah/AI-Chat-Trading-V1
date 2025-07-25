#!/bin/bash
echo "🔄 Menjalankan server AI Trading..."

# Pastikan berada di folder backend
cd backend || exit

# Jalankan server FastAPI
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
