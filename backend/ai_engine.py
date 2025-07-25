import os
from datetime import datetime
from memory import save_to_brain, get_ai_status
from vision import analyze_chart_image
from web_search import smart_web_search  # placeholder untuk integrasi nanti

BRAIN_PATH = "./brain/"

# ========================
# Agent Alpha & Beta Logic
# ========================

def handle_user_message(user_text):
    status = get_ai_status()
    replies = []

    # Simulasi Alpha & Beta berdiskusi
    if status == "start":
        alpha_reply = agent_alpha_respond(user_text)
        beta_reply = agent_beta_respond(alpha_reply)

        replies.append({"sender": "alpha", "message": alpha_reply})
        replies.append({"sender": "beta", "message": beta_reply})

        save_to_brain("user", user_text)
        save_to_brain("alpha", alpha_reply)
        save_to_brain("beta", beta_reply)
    else:
        replies.append({"sender": "developer", "message": "AI sedang dalam mode pause. Tekan tombol 'Mulai' untuk memulai diskusi AI."})

    return replies

def handle_image_upload(image_file):
    image_path = os.path.join(BRAIN_PATH, f"chart_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png")
    with open(image_path, "wb") as f:
        f.write(image_file.file.read())

    # Analisis chart
    analysis = analyze_chart_image(image_path)
    alpha_reply = agent_alpha_respond(analysis)
    beta_reply = agent_beta_respond(alpha_reply)

    save_to_brain("image", f"[Gambar chart disimpan di {image_path}]")
    save_to_brain("alpha", alpha_reply)
    save_to_brain("beta", beta_reply)

    return [
        {"sender": "alpha", "message": alpha_reply},
        {"sender": "beta", "message": beta_reply}
    ]

# ===================
# Simulasi Respon AI
# ===================

def agent_alpha_respond(text):
    # Placeholder logika Alpha (bisa gunakan model NLP ke depannya)
    if "long" in text.lower():
        return "Saya melihat potensi untuk open posisi LONG berdasarkan pola bullish."
    elif "short" in text.lower():
        return "Grafik menunjukkan tekanan jual, posisi SHORT lebih ideal."
    elif "gambar" in text.lower():
        return "Saya sedang memproses grafik, mari kita lihat pola dan volume-nya."
    else:
        return f"Setelah saya analisis, sepertinya kita perlu mempertimbangkan tren jangka menengah."

def agent_beta_respond(alpha_reply):
    # Placeholder logika Beta (manajemen risiko)
    if "LONG" in alpha_reply.upper():
        return "Saya sarankan SL di bawah support terdekat dan TP di resistance utama."
    elif "SHORT" in alpha_reply.upper():
        return "Gunakan SL di atas resistance, TP di area breakdown."
    else:
        return "Saya akan menyesuaikan SL dan TP berdasarkan volatilitas terbaru."

# =========================
# Agent Developer Analyzer
# =========================

def developer_analysis():
    messages = []

    # Cek folder dan file penting
    required = ["index.html", "styles.css", "main.js", "backend/app.py"]
    for file in required:
        if not os.path.exists(os.path.join("../", file)):
            messages.append({"sender": "developer", "message": f"⚠️ File `{file}` tidak ditemukan!"})

    # Saran logika lanjut
    messages.append({
        "sender": "developer",
        "message": "Struktur file sudah cukup baik. Saya menyarankan untuk mulai menambahkan logika AI sebenarnya pada agent_alpha_respond dan agent_beta_respond."
    })

    return messages
