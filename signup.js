document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const signupError = document.getElementById('signupError');
  
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupName.value;
      const email = signupEmail.value;
      const password = signupPassword.value;
      const confirmPassword = signupConfirmPassword.value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match';
        signupError.style.display = 'block';
        return;
      }
  
      if (users.find(user => user.email === email)) {
        signupError.textContent = 'Email already registered';
        signupError.style.display = 'block';
        return;
      }
  
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      window.location.href = 'login.html';
    });
  });
  