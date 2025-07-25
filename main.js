const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const imageInput = document.getElementById('imageInput');
const imageBtn = document.getElementById('imageBtn');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const devBtn = document.getElementById('devBtn');

// Status kontrol
let isRunning = false;

// Fungsi tampilkan pesan
function addMessage(sender, text) {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Kirim pesan teks ke backend
async function sendTextMessage(text) {
  addMessage('user', text);

  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (data.replies) {
      data.replies.forEach(reply => {
        addMessage(reply.sender, reply.message);
      });
    }
  } catch (err) {
    addMessage('developer', '⚠️ Gagal menghubungi server.');
    console.error(err);
  }
}

// Kirim gambar ke backend
async function sendImage(file) {
  addMessage('user', '[Gambar dikirim]');

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.replies) {
      data.replies.forEach(reply => {
        addMessage(reply.sender, reply.message);
      });
    }
  } catch (err) {
    addMessage('developer', '⚠️ Gagal mengirim gambar ke server.');
    console.error(err);
  }
}

// Event tombol kirim
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (text) {
    sendTextMessage(text);
    userInput.value = '';
  }
});

// Event upload gambar
imageBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    sendImage(file);
    imageInput.value = '';
  }
});

// Tombol kontrol AI
startBtn.addEventListener('click', async () => {
  isRunning = true;
  addMessage('developer', '🟢 Sistem AI dimulai...');
  await fetch('/api/control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start' }),
  });
});

pauseBtn.addEventListener('click', async () => {
  isRunning = false;
  addMessage('developer', '⏸️ Sistem AI dihentikan sementara.');
  await fetch('/api/control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'pause' }),
  });
});

devBtn.addEventListener('click', async () => {
  addMessage('developer', '🔍 Mengevaluasi kode aplikasi...');
  try {
    const response = await fetch('/api/developer', {
      method: 'GET',
    });
    const data = await response.json();
    data.replies.forEach(reply => {
      addMessage('developer', reply.message);
    });
  } catch (err) {
    addMessage('developer', '⚠️ Gagal menjalankan evaluasi Developer.');
    console.error(err);
  }
});
