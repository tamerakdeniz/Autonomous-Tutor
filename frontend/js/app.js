// Wait for the DOM to load before running scripts
document.addEventListener('DOMContentLoaded', function () {
    // Check login status from localStorage
    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && userData) {
      // User is logged in: update UI accordingly
      document.body.classList.add('logged-in');
      // Update avatar initials based on stored user name
      const avatarElem = document.querySelector('.avatar');
      if (avatarElem) {
        const user = JSON.parse(userData);
        let initials = '';
        if (user.name) {
          // Use first and last name initials if available
          const nameParts = user.name.trim().split(' ');
          if (nameParts.length >= 2) {
            const firstNameInitial = nameParts[0][0];
            const lastNameInitial = nameParts[nameParts.length - 1][0];
            initials = firstNameInitial + lastNameInitial;
          } else {
            initials = nameParts[0][0];
          }
          initials = initials.toUpperCase();
        } else {
          initials = '??';
        }
        avatarElem.textContent = initials;
      }
    } else {
      // Not logged in: ensure no logged-in class on body
      document.body.classList.remove('logged-in');
    }
  
    // Toggle dropdown menu when avatar is clicked
    const avatarButton = document.querySelector('.avatar');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (avatarButton && dropdownMenu) {
      avatarButton.addEventListener('click', function (e) {
        e.stopPropagation();  // Prevent click from bubbling up (to avoid immediate document click closing)
        dropdownMenu.classList.toggle('open');
      });
      // Close dropdown if clicking outside of it
      document.addEventListener('click', function () {
        dropdownMenu.classList.remove('open');
      });
      // (Optional) Close dropdown when a menu item is clicked
      dropdownMenu.querySelectorAll('a').forEach(function(item) {
        item.addEventListener('click', function () {
          dropdownMenu.classList.remove('open');
        });
      });
    }
  
    // Log Out: clear localStorage and redirect to homepage
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.clear();  // Clear all stored data (end session)
        window.location.href = 'index.html';
      });
    }
  
    // Handle Login form submission
    const loginForm = document.querySelector('form.form');
    if (loginForm && document.getElementById('login-email')) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        const email = emailInput.value.trim();
        const password = passInput.value;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (email === userObj.email && password === userObj.password) {
            // Credentials match, log the user in
            localStorage.setItem('isLoggedIn', 'true');
            // Redirect to dashboard after successful login
            window.location.href = 'dashboard.html';
          } else {
            alert('Invalid email or password. Please try again.');
          }
        } else {
          alert('No account found. Please register first.');
        }
      });
    }
  
    // Handle Register form submission
    const registerForm = document.querySelector('form.form');
    if (registerForm && document.getElementById('reg-email')) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const passInput = document.getElementById('reg-pass');
        const passConfirmInput = document.getElementById('reg-pass2');
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passInput.value;
        const password2 = passConfirmInput.value;
        if (password !== password2) {
          alert('Passwords do not match. Please check and try again.');
          return;
        }
        // Save the new user's data in localStorage
        const newUser = { name: name, email: email, password: password };
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'false');  // user is not logged in yet
        // Redirect to login page after successful registration
        window.location.href = 'login.html';
      });
    }
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
      const avatar = userDropdown.querySelector('.avatar');
  
      avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
      });
  
      document.addEventListener('click', () => {
        userDropdown.classList.remove('open');
      });
    }
  });
  