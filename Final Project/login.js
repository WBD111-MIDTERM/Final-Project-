// Login/Register form toggle functionality
function toggleForms(event) {
  event.preventDefault();
  const loginForm = document.getElementById('loginFormWrapper');
  const registerForm = document.getElementById('registerFormWrapper');
  const forgotPanel = document.getElementById('forgotPasswordPanel');

  if (forgotPanel) {
    forgotPanel.style.display = 'none';
  }

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

function getSavedUsers() {
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : {};
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function clearLoginState() {
  ['isLoggedIn', 'userEmail', 'userType', 'userName'].forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

function getUserByEmail(email) {
  if (!email) return null;
  const users = getSavedUsers();
  return users[email.toLowerCase()] || null;
}

function storeLoginState({ email, userType, name }, rememberMe) {
  clearLoginState();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('isLoggedIn', 'true');
  storage.setItem('userEmail', email);
  storage.setItem('userType', userType);
  if (name) {
    storage.setItem('userName', name);
  }

  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('rememberedEmail', email);
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
  }
}

function getRememberedEmail() {
  return localStorage.getItem('rememberedEmail') || '';
}

function showForgotPasswordPanel() {
  const forgotPanel = document.getElementById('forgotPasswordPanel');
  const loginForm = document.getElementById('loginForm');
  if (forgotPanel) {
    forgotPanel.style.display = 'block';
  }
  if (loginForm) {
    loginForm.style.display = 'none';
  }
}

function hideForgotPasswordPanel() {
  const forgotPanel = document.getElementById('forgotPasswordPanel');
  const loginForm = document.getElementById('loginForm');
  if (forgotPanel) {
    forgotPanel.style.display = 'none';
  }
  if (loginForm) {
    loginForm.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const rememberedEmail = getRememberedEmail();
  const rememberCheckbox = document.getElementById('rememberMe');
  if (rememberedEmail) {
    document.getElementById('email').value = rememberedEmail;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }

  const loggedIn = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn');
  if (loggedIn) {
    const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
    if (userType === 'staff') {
      window.location.href = 'staff.html';
      return;
    } else if (userType === 'admin') {
      window.location.href = 'admin.html';
      return;
    }
    window.location.href = 'user.html';
    return;
  }

  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe').checked;
    const email = emailElement.value.trim().toLowerCase();
    const password = passwordElement.value.trim();

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    let userType = 'customer';
    let name = '';
    const savedUser = getUserByEmail(email);

    if (savedUser) {
      if (savedUser.password !== password) {
        alert('Incorrect password. Please try again.');
        return;
      }
      userType = savedUser.userType || 'customer';
      name = savedUser.name || '';
    } else if (email === 'anthony@origincafe.staff.com') {
      userType = 'staff';
      name = 'Anthony';
    } else if (email === 'conny@origincafe.admin.com') {
      userType = 'admin';
      name = 'Conny';
    } else {
      const users = getSavedUsers();
      users[email] = { email, password, userType: 'customer', name: '' };
      saveUsers(users);
    }

    storeLoginState({ email, userType, name }, rememberMe);

    alert('Login successful! Redirecting...');
    if (userType === 'staff') {
      window.location.href = 'staff.html';
    } else if (userType === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'user.html';
    }
  });

  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!name || !email || !password) {
      alert('Please complete all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const users = getSavedUsers();
    if (users[email]) {
      alert('An account with this email already exists. Please log in instead.');
      return;
    }

    users[email] = { email, password, userType: 'customer', name };
    saveUsers(users);

    storeLoginState({ email, userType: 'customer', name }, false);

    alert('Registration successful! Redirecting...');
    window.location.href = 'user.html';
  });

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      showForgotPasswordPanel();
    });
  }

  const cancelForgot = document.getElementById('cancelForgotPassword');
  if (cancelForgot) {
    cancelForgot.addEventListener('click', function() {
      hideForgotPasswordPanel();
    });
  }

  const backToLogin = document.getElementById('backToLogin');
  if (backToLogin) {
    backToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      hideForgotPasswordPanel();
    });
  }

  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value.trim().toLowerCase();
      const password = document.getElementById('resetPassword').value;
      const confirmPassword = document.getElementById('resetConfirmPassword').value;

      if (!email || !password) {
        alert('Please enter your email and a new password.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const users = getSavedUsers();
      if (!users[email] && email !== 'anthony@origincafe.staff.com' && email !== 'conny@origincafe.admin.com') {
        alert('No account found for that email.');
        return;
      }

      const isStaff = email === 'anthony@origincafe.staff.com';
      const isAdmin = email === 'conny@origincafe.admin.com';
      users[email] = {
        email,
        password,
        userType: isStaff ? 'staff' : isAdmin ? 'admin' : 'customer',
        name: users[email] ? users[email].name : isStaff ? 'Anthony' : isAdmin ? 'Conny' : ''
      };
      saveUsers(users);

      alert('Password reset successful. Please log in with your new password.');
      hideForgotPasswordPanel();
      document.getElementById('email').value = email;
      document.getElementById('password').value = '';
    });
  }
});
