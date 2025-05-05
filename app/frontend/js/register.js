// Initialize language selector on page load
document.addEventListener('DOMContentLoaded', function () {
  const currentLang = getCurrentLanguage();
  document.getElementById('ui-language').value = currentLang;
});

function showNotification(messageKey, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${
        type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
      }"></i>
      <span>${translateText(messageKey)}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function showLoading() {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);
}

function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    document.body.removeChild(loadingOverlay);
  }
}

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const language = document.getElementById('language').value;

  if (!username || !password || !confirmPassword) {
    showNotification('fillAllFields', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('passwordsNoMatch', 'error');
    return;
  }

  localStorage.setItem('selectedLanguage', language);
  showLoading();

  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      hideLoading();
      if (data.message.includes('successfully')) {
        showNotification('regSuccess', 'success');
        setTimeout(() => {
          window.location = 'login.html';
        }, 1500);
      } else {
        showNotification('errorOccurred', 'error');
      }
    })
    .catch(err => {
      hideLoading();
      showNotification('errorOccurred', 'error');
    });
}
