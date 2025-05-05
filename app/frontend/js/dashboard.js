document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location = 'login.html';
    return;
  }

  document.getElementById(
    'username-display'
  ).textContent = `Welcome, ${username}!`;
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
    activityLogElement.innerHTML =
      '<p class="text-center">No recent activity</p>';
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
        ${activity.description}
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

  let icon, description;
  switch (mode) {
    case 'wrong-code':
      icon = 'fa-bug';
      description = 'Started a Wrong Code Analysis session';
      break;
    case 'correct-code':
      icon = 'fa-check-circle';
      description = 'Started a Correct Code Analysis session';
      break;
    default:
      icon = 'fa-code';
      description = 'Started a learning session';
  }

  const now = new Date();
  const time = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();

  activityLog.unshift({ time, icon, description });
  if (activityLog.length > 10) {
    activityLog.pop();
  }

  localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function clearActivity() {
  localStorage.removeItem('activityLog');
  document.getElementById('activity-log').innerHTML =
    '<p class="text-center">No recent activity</p>';
}

function logout() {
  localStorage.removeItem('username');
  window.location = 'login.html';
}
