import os
from datetime import datetime
import json

BRAIN_PATH = "./brain/"
STATUS_FILE = os.path.join(BRAIN_PATH, "status.json")
LOG_FILE = os.path.join(BRAIN_PATH, "chat_log.txt")

# Pastikan folder brain tersedia
os.makedirs(BRAIN_PATH, exist_ok=True)

# ====================
# STATUS AI (Start/Pause)
# ====================

def set_ai_status(status: str):
    """Simpan status AI: 'start' atau 'pause'"""
    with open(STATUS_FILE, "w") as f:
        json.dump({"status": status}, f)

def get_ai_status() -> str:
    """Ambil status AI"""
    if not os.path.exists(STATUS_FILE):
        set_ai_status("pause")
    with open(STATUS_FILE, "r") as f:
        data = json.load(f)
    return data.get("status", "pause")

# ====================
# SIMPAN PESAN/LOG
# ====================

def save_to_brain(sender: str, message: str):
    """Simpan log chat ke brain/chat_log.txt"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log = f"[{timestamp}] {sender.upper()}: {message}\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log)
