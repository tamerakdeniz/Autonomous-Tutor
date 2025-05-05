document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  const username = localStorage.getItem('username');
  if (!username) {
    window.location = 'login.html';
    return;
  }

  // Get learning mode and selected language
  const learningMode = localStorage.getItem('learningMode') || 'general';
  const selectedLanguage = localStorage.getItem('selectedLanguage') || 'Python';

  // Set mode indicator
  const modeIndicator = document.getElementById('mode-indicator');
  let modeText, modeIcon;

  switch (learningMode) {
    case 'wrong-code':
      modeText = `Wrong Code Analysis (${selectedLanguage})`;
      modeIcon = 'fa-bug';
      break;
    case 'correct-code':
      modeText = `Correct Code Analysis (${selectedLanguage})`;
      modeIcon = 'fa-check-circle';
      break;
    default:
      modeText = 'General Chat';
      modeIcon = 'fa-comments';
  }

  modeIndicator.innerHTML = `<i class="fas ${modeIcon} mr-2"></i>${modeText}`;

  // Send initial message based on mode
  sendInitialMessage(learningMode);
});

function sendInitialMessage(mode) {
  const language = localStorage.getItem('selectedLanguage') || 'Python';
  let initialMessage;

  switch (mode) {
    case 'wrong-code':
      initialMessage = `I'd like to practice finding and fixing errors in ${language} code. Can you give me a code snippet with bugs to analyze?`;
      break;
    case 'correct-code':
      initialMessage = `I want to understand why certain ${language} code works correctly. Can you provide a code example and explain the best practices it demonstrates?`;
      break;
    default:
      initialMessage =
        "Hello! I'm here to learn programming. How can you help me today?";
  }

  createMessageBubble(initialMessage, 'user');
  showTypingIndicator();

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: localStorage.getItem('username'),
      message: initialMessage,
      mode: mode,
      language: language
    })
  })
    .then(res => res.json())
    .then(data => {
      hideTypingIndicator();
      createMessageBubble(data.response, 'bot');
      const problems = parseInt(localStorage.getItem('problems') || 0) + 1;
      localStorage.setItem('problems', problems);
    })
    .catch(err => {
      hideTypingIndicator();
      createMessageBubble(
        'Sorry, there was an error connecting to the tutor. Please try again.',
        'bot'
      );
    });
}

function createMessageBubble(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  if (sender === 'bot') {
    const html = marked.parse(text);
    const processed = html.replace(
      /<pre(?:><code>)?([\s\S]*?)(?:<\/code>)?<\/pre>/g,
      (match, codeContent) => {
        const lines = codeContent
          .split('\n')
          .map(line => `<span>${line}</span>`)
          .join('');
        return `
        <div class="code-container">
          <button class="copy-button" onclick="copyCode(this)">Copy</button>
          <pre><code>${lines}</code></pre>
        </div>`;
      }
    );

    messageDiv.innerHTML = processed;
  } else {
    messageDiv.innerText = text;
  }

  messageDiv.style.cursor = 'pointer';
  messageDiv.title = 'Click to copy this message';
  messageDiv.addEventListener('click', function () {
    const input = document.getElementById('message');
    input.value = text;
    input.focus();
  });

  document.getElementById('chat').appendChild(messageDiv);
  document.getElementById('chat').scrollTop =
    document.getElementById('chat').scrollHeight;
}

function sendMessage() {
  const username = localStorage.getItem('username');
  const message = document.getElementById('message').value;
  const mode = localStorage.getItem('learningMode') || 'general';
  const language = localStorage.getItem('selectedLanguage') || 'Python';

  if (!message.trim()) return;

  createMessageBubble(message, 'user');
  document.getElementById('message').value = '';

  showTypingIndicator();

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      message,
      mode,
      language
    })
  })
    .then(res => res.json())
    .then(data => {
      hideTypingIndicator();
      createMessageBubble(data.response, 'bot');
    })
    .catch(err => {
      hideTypingIndicator();
      createMessageBubble(
        'Sorry, there was an error connecting to the tutor. Please try again.',
        'bot'
      );
    });
}

function copyCode(button) {
  const container = button.parentElement;
  const code = container.querySelectorAll('code span');
  const text = Array.from(code)
    .map(span => span.innerText)
    .join('\n');

  navigator.clipboard.writeText(text).then(() => {
    button.classList.add('copied');
    container.classList.add('highlight');

    setTimeout(() => {
      button.classList.remove('copied');
      container.classList.remove('highlight');
    }, 2000);
  });
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  document.getElementById('chat').appendChild(typingDiv);
  document.getElementById('chat').scrollTop =
    document.getElementById('chat').scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Add event listener for Enter key in message input
const input = document.getElementById('message');
input.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});
