const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Gunakan API key Groq milik Anda
const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "mixtral-8x7b-32768";

// === Prompt dasar tiap agen ===
function getSystemPrompt(role) {
  const brainNote = `Semua data dan hasil diskusi disimpan di folder "./brain/" dan dapat digunakan bersama.`;

  if (role === "alpha") {
    return `
Kamu adalah Agent Alpha, seorang AI trading profesional spesialis teknikal dan analisis pasar BTC/USDT futures.
Selalu diskusikan dan belajar bersama Agent Beta agar menjadi trader yang sangat cerdas dan selalu profit.
${brainNote}
Gunakan bahasa Indonesia.
    `.trim();
  }

  if (role === "beta") {
    return `
Kamu adalah Agent Beta, AI ahli manajemen risiko dan strategi perdagangan BTC/USDT futures.
Diskusikan dengan Agent Alpha untuk menyempurnakan rencana trading.
${brainNote}
Gunakan bahasa Indonesia.
    `.trim();
  }

  if (role === "developer") {
    return `
Kamu adalah Agent Developer, AI pengembang sistem aplikasi ini.
Bacalah struktur folder, kode, dan log diskusi AI dari folder "./brain/", lalu bantu pengguna memperbaiki dan meningkatkan sistem.
Jika ada kekurangan, beri tahu dan bantu buatkan skrip JavaScript atau Node.js baru.
Gunakan bahasa Indonesia.
    `.trim();
  }

  return "Kamu adalah AI asisten dalam sistem trading futures BTC/USDT berbasis web. Gunakan bahasa Indonesia.";
}

// === Fungsi utama: kirim ke Groq API dan ambil balasan ===
async function askAI(role, userMessage) {
  const messages = [
    { role: "system", content: getSystemPrompt(role) },
    { role: "user", content: userMessage },
  ];

  const body = {
    model: MODEL_NAME,
    messages,
    temperature: 0.7,
  };

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("Tidak ada balasan dari Groq API.");
    }

    const content = data.choices[0].message.content;
    const replyRole = role === "developer" ? "developer" : role === "beta" ? "beta" : "alpha";

    // Simpan ke memori lokal (opsional)
    saveToMemory(role, userMessage, content);

    return [
      {
        role: replyRole,
        content,
      },
    ];
  } catch (err) {
    console.error("❌ Gagal mengakses Groq API:", err.message);
    return [
      {
        role: "developer",
        content: "⚠️ Terjadi kesalahan saat menghubungi AI. Silakan cek koneksi atau API key.",
      },
    ];
  }
}

// Simpan obrolan ke ./brain/memory.json
function saveToMemory(role, input, output) {
  const filePath = path.join(__dirname, "brain", "memory.json");

  let log = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath);
    try {
      log = JSON.parse(raw);
    } catch (e) {
      log = [];
    }
  }

  log.push({
    timestamp: new Date().toISOString(),
    role,
    input,
    output,
  });

  fs.writeFileSync(filePath, JSON.stringify(log, null, 2));
}

module.exports = { askAI };
