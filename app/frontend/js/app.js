const chatContainer = document.getElementById('chat');
const inputField = document.getElementById('inputMessage');
const sendButton = document.getElementById('sendButton');
const modeSelector = document.getElementById('modeSelector');

let username =
  localStorage.getItem('username') || prompt('Enter your username:');
localStorage.setItem('username', username);

function createMessageElement(text, sender = 'bot') {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message', sender);
  messageEl.innerHTML = text;
  chatContainer.appendChild(messageEl);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  createMessageElement(message, 'user');
  inputField.value = '';

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      message,
      mode: modeSelector.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.type === 'multiple-choice') {
        let formattedOptions = data.options
          .map((opt, index) => {
            const letter = String.fromCharCode(97 + index); // a,b,c,d
            return `(${letter}) ${opt}`;
          })
          .join('\n');

        const combined = `<strong>${data.question}</strong>\n\n<pre>${formattedOptions}</pre>`;
        createMessageElement(combined, 'bot');
      } else {
        createMessageElement(data.response, 'bot');
      }
    })
    .catch(() => {
      createMessageElement('❌ Error contacting server.', 'bot');
    });
}

sendButton.addEventListener('click', sendMessage);

inputField.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});
