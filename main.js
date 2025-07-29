// main.js
const chatContainer = document.getElementById("chat");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const developerBtn = document.getElementById("developer-btn");

let isRunning = false;
let role = "user"; // default pengirim pesan

// Format pesan ke tampilan UI
function addMessageToChat(sender, message) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = `${sender}: ${message}`;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Kirim pesan ke server dan tunggu balasan AI
async function sendMessageToServer(sender, message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: sender, message }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Server response error:", errText);
      addMessageToChat("system", "⚠️ Gagal mengirim pesan ke server.");
      return;
    }

    const data = await response.json();
    addMessageToChat(sender, message); // tampilkan pesan pengguna
    addMessageToChat("AI", data.reply); // tampilkan balasan AI
  } catch (error) {
    console.error("❌ Fetch error:", error);
    addMessageToChat("system", "❌ Tidak dapat terhubung ke server.");
  }
}

// Fungsi kirim pesan (manual oleh user)
function handleSend() {
  const message = input.value.trim();
  if (!message) return;
  sendMessageToServer(role, message);
  input.value = "";
}

// Event klik tombol kirim
sendBtn.addEventListener("click", handleSend);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

// Jalankan simulasi obrolan antar Alpha dan Beta
async function simulateConversation() {
  let message = "Halo, menurutmu market BTC hari ini bagaimana?";
  let turn = "alpha";

  while (isRunning) {
    addMessageToChat(turn, message);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: turn, message }),
    });

    if (!response.ok) {
      addMessageToChat("system", "⚠️ Error saat komunikasi antar AI.");
      break;
    }

    const data = await response.json();
    message = data.reply;

    // Ganti giliran
    turn = turn === "alpha" ? "beta" : "alpha";

    await new Promise((res) => setTimeout(res, 3000)); // jeda 3 detik antar AI
  }
}

// Tombol MULAI: memicu obrolan antara Alpha dan Beta
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    simulateConversation();
    addMessageToChat("system", "🟢 AI Alpha dan Beta mulai berdiskusi...");
  }
});

// Tombol PAUSE: hentikan obrolan
pauseBtn.addEventListener("click", () => {
  isRunning = false;
  addMessageToChat("system", "⏸️ Obrolan AI dijeda.");
});

// Tombol DEVELOPER: panggil AI Developer
developerBtn.addEventListener("click", () => {
  const message = "Cek kode aplikasi dan beritahu kekurangan atau saran perbaikan.";
  role = "developer";
  sendMessageToServer(role, message);
});
