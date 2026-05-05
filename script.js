// Authentication check for protected pages
if (window.location.pathname.includes('menu.html') || window.location.pathname.includes('milktea.html') || window.location.pathname.includes('pastabread.html') || window.location.pathname.includes('user.html') || window.location.pathname.includes('staff.html') || window.location.pathname.includes('admin.html')) {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
  }
}
 
// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
}

// Check login status and update login button
document.addEventListener('DOMContentLoaded', function() {
  const userType = localStorage.getItem('userType');
  if (window.location.pathname.includes('user.html') && userType !== 'customer') {
    window.location.href = localStorage.getItem('isLoggedIn') ? 'menu.html' : 'login.html';
    return;
  }

  if (window.location.pathname.includes('staff.html') && userType !== 'staff') {
    window.location.href = localStorage.getItem('isLoggedIn') ? 'menu.html' : 'login.html';
    return;
  }

  if (window.location.pathname.includes('admin.html') && userType !== 'admin') {
    window.location.href = localStorage.getItem('isLoggedIn') ? 'menu.html' : 'login.html';
    return;
  }

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    if (localStorage.getItem('isLoggedIn')) {
      loginBtn.textContent = 'Logout';
      loginBtn.href = '#';
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    }
  }

  const accountEmail = document.getElementById('accountEmail');
  if (accountEmail) {
    accountEmail.textContent = localStorage.getItem('userEmail') || 'Customer';
  }

  const accountType = document.getElementById('accountType');
  if (accountType) {
    accountType.textContent = userType || 'customer';
  }

  const userLogout = document.getElementById('userLogout');
  if (userLogout) {
    userLogout.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }

  document.querySelectorAll('[data-logout]').forEach(logoutLink => {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });

  const adminTabs = document.querySelectorAll('[data-admin-tab]');
  const adminPanels = document.querySelectorAll('[data-admin-panel]');
  if (adminTabs.length && adminPanels.length) {
    const showAdminPanel = (panelName) => {
      adminTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.adminTab === panelName);
      });
      adminPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.adminPanel === panelName);
      });
    };

    adminTabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        showAdminPanel(tab.dataset.adminTab);
        window.location.hash = tab.dataset.adminTab;
      });
    });

    const startingPanel = window.location.hash.replace('#', '') || adminTabs[0].dataset.adminTab;
    showAdminPanel(startingPanel);
  }

  // Quantity controls functionality
  document.querySelectorAll('.quantity-controls').forEach(control => {
    const buttons = control.querySelectorAll('.qty-btn');
    const display = control.querySelector('.qty-display');
    let quantity = 0;

    buttons[0].addEventListener('click', () => {
      if (quantity > 0) quantity--;
      display.textContent = quantity;
    });

    buttons[1].addEventListener('click', () => {
      quantity++;
      display.textContent = quantity;
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formNote = contactForm.querySelector('.form-note');
      if (formNote) {
        formNote.textContent = 'Thanks for reaching out. Our cafe team will get back to you soon.';
      }
      contactForm.reset();
    });
  }
});
