===============================
📘 APLIKASI AI TRADING BTC/USDT
===============================

🔧 PERSYARATAN
---------------
1. Python 3.9 atau lebih baru
2. Pip (package manager Python)
3. FastAPI, Uvicorn, Pillow (untuk upload gambar)

📁 STRUKTUR FOLDER
------------------
📦 root/
├── index.html
├── styles.css
├── main.js
├── 📁 assets/
├── 📁 brain/
├── 📁 backend/
│   ├── app.py
│   ├── ai_engine.py
│   ├── memory.py
│   ├── vision.py
│   └── web_search.py

📥 INSTALASI DEPENDENSI
-----------------------
Buka terminal lalu jalankan:

> pip install fastapi uvicorn pillow

📦 (Opsional) Untuk pencarian internet:
> pip install requests

▶️ JALANKAN APLIKASI
---------------------
Masuk ke folder backend dan jalankan:

> python app.py

Akses di browser:  
http://localhost:8000

📱 DI TERMUX (ANDROID)
-----------------------
1. Install Python: `pkg install python`
2. Install pip: `pip install --upgrade pip`
3. Install git (jika perlu): `pkg install git`
4. Clone folder atau salin semua file
5. Jalankan:
   > pip install fastapi uvicorn pillow  
   > cd backend  
   > python app.py

📂 SEMUA CHAT DAN GAMBAR DISIMPAN DI:
--------------------------------------
📁 ./brain/chat_log.txt  
📁 ./brain/chart_YYYYMMDD_HHMMSS.png

📌 TOMBOL ANTARMUKA
--------------------
🔹 Mulai: Mengaktifkan AI Alpha & Beta agar saling berdiskusi  
🔹 Pause: Menghentikan obrolan AI  
🔹 Developer: Mengevaluasi kekurangan aplikasi dan menyarankan update kode
