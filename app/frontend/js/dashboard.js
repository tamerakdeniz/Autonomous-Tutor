document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location = 'login.html';
    return;
  }

  document.getElementById('username-display').innerHTML = `${translateText(
    'welcome'
  )}, ${username}!`;

  // Set selected UI language
  const currentLang = getCurrentLanguage();
  document.getElementById('ui-language').value = currentLang;

  // Set selected programming language
  const selectedLang = localStorage.getItem('selectedLanguage') || 'Python';
  document.getElementById('language-select').value = selectedLang;

  loadUserStats();
  loadActivityLog();
});

function changeLanguage() {
  const selectedLang = document.getElementById('language-select').value;
  localStorage.setItem('selectedLanguage', selectedLang);
}

function loadUserStats() {
  const sessions = localStorage.getItem('sessions') || 0;
  const problems = localStorage.getItem('problems') || 0;

  document.getElementById('sessions-count').textContent = sessions;
  document.getElementById('problems-count').textContent = problems;
}

function loadActivityLog() {
  const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
  const activityLogElement = document.getElementById('activity-log');

  if (activityLog.length === 0) {
    activityLogElement.innerHTML = `<p class="text-center">${translateText(
      'noActivity'
    )}</p>`;
    return;
  }

  activityLogElement.innerHTML = '';
  activityLog.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-time">${activity.time}</div>
      <div class="activity-description">
        <i class="fas ${activity.icon} mr-2"></i>
        ${translateText(activity.descriptionKey)}
      </div>
    `;
    activityLogElement.appendChild(activityItem);
  });
}

function startLearningMode(mode) {
  localStorage.setItem('learningMode', mode);
  const sessions = parseInt(localStorage.getItem('sessions') || 0) + 1;
  localStorage.setItem('sessions', sessions);
  addActivity(mode);
  window.location = 'chat.html';
}

function addActivity(mode) {
  const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];

  let icon, descriptionKey;
  switch (mode) {
    case 'wrong-code':
      icon = 'fa-bug';
      descriptionKey = 'wrongCodeAnalysis';
      break;
    case 'correct-code':
      icon = 'fa-check-circle';
      descriptionKey = 'correctCodeAnalysis';
      break;
    default:
      icon = 'fa-code';
      descriptionKey = 'learningSession';
  }

  const now = new Date();
  const time = formatDateTime(now);

  activityLog.unshift({ time, icon, descriptionKey });
  if (activityLog.length > 10) {
    activityLog.pop();
  }

  localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function clearActivity() {
  localStorage.removeItem('activityLog');
  document.getElementById(
    'activity-log'
  ).innerHTML = `<p class="text-center">${translateText('noActivity')}</p>`;
}

function logout() {
  localStorage.removeItem('username');
  window.location = 'login.html';
}
