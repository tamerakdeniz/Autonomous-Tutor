// Common utility functions for the application

// Language management
let currentLanguage = localStorage.getItem('uiLanguage') || 'en';

function getCurrentLanguage() {
  return currentLanguage;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('uiLanguage', lang);
  translatePage();
}

function translateText(key) {
  return translations[currentLanguage][key] || translations['en'][key] || key;
}

function translatePage() {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
      element.placeholder = translateText(key);
    } else {
      element.textContent = translateText(key);
    }
  });
}

// Check if a user is logged in and redirect if not
function checkAuth() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location = 'login.html';
    return false;
  }
  return true;
}

// Get the current user's selected programming language
function getSelectedLanguage() {
  return localStorage.getItem('selectedLanguage') || 'Python';
}

// Format date/time consistently across the application
function formatDateTime(date) {
  return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
}

// Common fetch wrapper with error handling
async function fetchWithErrorHandling(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw new Error('An error occurred while connecting to the server.');
  }
}

// Initialize translations when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  translatePage();
});
