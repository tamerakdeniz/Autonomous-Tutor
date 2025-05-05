function showFeedback(messageKey, type) {
  const feedbackDiv = document.getElementById('feedback-message');
  feedbackDiv.className = `alert alert-${type} text-center`;
  feedbackDiv.textContent = translateText(messageKey);
  feedbackDiv.classList.remove('d-none');
}

function login(event) {
  if (event) {
    event.preventDefault();
  }

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showFeedback('fillAllFields', 'danger');
    return;
  }

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message.includes('successful')) {
        showFeedback('loginSuccess', 'success');
        localStorage.setItem('username', username);
        setTimeout(() => {
          window.location = 'dashboard.html';
        }, 1500);
      } else {
        showFeedback('errorOccurred', 'danger');
      }
    })
    .catch(err => {
      showFeedback('errorOccurred', 'danger');
    });
}
