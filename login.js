document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value;
      const password = loginPassword.value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);
  
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        loginError.textContent = 'Invalid email or password';
        loginError.style.display = 'block';
      }
    });
  });
  