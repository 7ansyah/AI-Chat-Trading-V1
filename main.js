// Elemen HTML
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatContainer = document.getElementById("chat-container");
const imageUpload = document.getElementById("image-upload");
const btnStart = document.getElementById("btn-start");
const btnDeveloper = document.getElementById("btn-developer");

let conversationActive = false;

// Tambahkan pesan ke UI
function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");

  if (sender === "alpha") bubble.classList.add("chat-alpha");
  else if (sender === "beta") bubble.classList.add("chat-beta");
  else if (sender === "developer") bubble.classList.add("chat-developer");
  else bubble.classList.add("chat-user");

  bubble.innerText = text;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Kirim pesan teks ke server
async function sendMessageToServer(role, message) {
  appendMessage("user", message);

  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, message }),
    });

    const data = await res.json();

    data.replies.forEach(reply => {
      appendMessage(reply.role, reply.content);
    });
  } catch (err) {
    appendMessage("developer", "⚠️ Gagal mengirim pesan ke server.");
    console.error(err);
  }
}

// Kirim gambar chart ke server
async function sendImageToServer(file) {
  const formData = new FormData();
  formData.append("image", file);

  appendMessage("user", "📷 Mengirim gambar chart...");

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    data.replies.forEach(reply => {
      appendMessage(reply.role, reply.content);
    });
  } catch (err) {
    appendMessage("developer", "⚠️ Gagal mengirim gambar.");
    console.error(err);
  }
}

// Kirim tombol atau perintah awal
function triggerStartConversation() {
  conversationActive = true;
  appendMessage("system", "🟢 Obrolan dimulai. Alpha & Beta aktif.");
  sendMessageToServer("system", "Mulai diskusi trading sekarang.");
}

function triggerDeveloperCheck() {
  sendMessageToServer("developer", "Periksa kode sistem dan beri saran pengembangan.");
}

// Tombol Kirim
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (!message) return;
  sendMessageToServer("user", message);
  chatInput.value = "";
});

// Tombol Enter keyboard
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

// Tombol Mulai
btnStart.addEventListener("click", () => {
  if (!conversationActive) triggerStartConversation();
});

// Tombol Developer
btnDeveloper.addEventListener("click", () => {
  triggerDeveloperCheck();
});

// Klik ikon untuk unggah gambar
document.querySelector(".chat-input-footer::before")?.addEventListener("click", () => {
  imageUpload.click();
});

// Upload Gambar Chart
imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) sendImageToServer(file);
});
