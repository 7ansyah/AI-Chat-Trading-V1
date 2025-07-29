// groq_agent.js
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct";

async function askAI(role, messages) {
  const systemPrompt = {
    "alpha": "Kamu adalah Alpha, AI analis grafik trading crypto futures BTC/USDT. Gunakan bahasa Indonesia.",
    "beta": "Kamu adalah Beta, AI trader profesional crypto BTC/USDT. Gunakan bahasa Indonesia.",
    "developer": "Kamu adalah Developer, AI pengembang sistem aplikasi AI trading ini. Tugasmu adalah mencari, mengevaluasi, dan mengembangkan kode. Gunakan bahasa Indonesia.",
  }[role.toLowerCase()] || "Kamu adalah AI assistant. Gunakan bahasa Indonesia.";

  const payload = {
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 2048,
  };

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Groq API Error Response:", errText);
      return "Terjadi kesalahan dari server AI. Periksa model atau API key.";
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "AI tidak memberikan respon.";
    return reply;
  } catch (error) {
    console.error("❌ Koneksi gagal ke Groq:", error);
    return "Tidak dapat menghubungi server AI. Pastikan koneksi internet dan API key benar.";
  }
}

module.exports = { askAI };
