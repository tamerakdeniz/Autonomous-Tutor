// Core application initialization
import './app.js';
import './particles.js';
import './translations.js';

// Route-specific modules
import './chat.js';
import './dashboard.js';
import './login.js';
import './register.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log('Application initialized');
});

// Enable hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
