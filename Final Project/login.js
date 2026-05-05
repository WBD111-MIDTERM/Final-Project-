// Login/Register form toggle functionality
function toggleForms(event) {
  event.preventDefault();
  const loginForm = document.getElementById('loginFormWrapper');
  const registerForm = document.getElementById('registerFormWrapper');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
  // Login form handler
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    let userType = 'customer';
    if (email.toLowerCase() === 'anthony@origincafe.staff.com') {
      userType = 'staff';
    } else if (email.toLowerCase() === 'conny@origincafe.admin.com') {
      userType = 'admin';
    }

    // Save login state to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userType', userType);

    alert('Login successful! Redirecting...');
    if (userType === 'staff') {
      window.location.href = 'staff.html';
    } else if (userType === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'user.html';
    }
  });

  // Register form handler
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Save login state to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userType', 'customer');

    alert('Registration successful! Redirecting...');
    window.location.href = 'user.html';
  });
});
