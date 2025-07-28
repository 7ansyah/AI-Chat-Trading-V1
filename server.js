const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { askAI } = require("./groq_agent"); // kita buat sebentar lagi

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("./")); // serve index.html & static assets

// Setup penyimpanan gambar chart
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./brain/images";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `chart_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ===== ROUTES =====

// 📩 Chat: kirim pesan dari user → AI
app.post("/api/message", async (req, res) => {
  const { role, message } = req.body;

  if (!message) return res.status(400).json({ error: "Pesan kosong." });

  try {
    const replies = await askAI(role, message);
    res.json({ replies });
  } catch (err) {
    console.error("❌ Error AI:", err.message);
    res.status(500).json({ error: "Gagal memproses permintaan." });
  }
});

// 📷 Gambar Chart: kirim gambar → AI proses
app.post("/api/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Tidak ada file gambar." });

  const imagePath = path.join(__dirname, req.file.path);
  const message = `Tolong analisa gambar chart berikut dan berikan rekomendasi open posisi, stop loss, dan take profit: ${imagePath}`;

  try {
    const replies = await askAI("alpha", message); // default ke Alpha untuk gambar
    res.json({ replies });
  } catch (err) {
    console.error("❌ Error AI saat proses gambar:", err.message);
    res.status(500).json({ error: "Gagal memproses gambar." });
  }
});

// Mulai server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
