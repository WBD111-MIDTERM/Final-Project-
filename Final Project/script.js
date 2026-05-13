// Authentication check for protected pages
const protectedPages = ['user.html', 'staff.html', 'admin.html'];
const currentPath = window.location.pathname;

const getLoginValue = (key) => sessionStorage.getItem(key) || localStorage.getItem(key);
const isUserLoggedIn = () => !!getLoginValue('isLoggedIn');
const clearLoginState = () => {
  ['isLoggedIn', 'userEmail', 'userType', 'userName'].forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

if (protectedPages.some(page => currentPath.includes(page))) {
  if (!isUserLoggedIn()) {
    window.location.href = 'login.html';
  }
}
 
// Logout function
function logout() {
  clearLoginState();
  window.location.href = 'login.html';
}

// Check login status and update login button
document.addEventListener('DOMContentLoaded', function() {
  const userType = getLoginValue('userType');
  const isLoggedIn = isUserLoggedIn();

  // Role-based access control configuration
  const roleRedirects = {
    'user.html': 'customer',
    'staff.html': 'staff',
    'admin.html': 'admin'
  };

  const requiredRole = Object.keys(roleRedirects).find(page => currentPath.includes(page));
  if (requiredRole && userType !== roleRedirects[requiredRole]) {
    window.location.href = isLoggedIn ? 'menu.html' : 'login.html';
    return;
  }

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    if (isLoggedIn) {
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
    accountEmail.textContent = getLoginValue('userEmail') || 'Customer';
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
    const orderBtn = control.closest('.menu-card').querySelector('.order-btn');
    const itemName = control.closest('.menu-card').querySelector('h3').textContent;
    let quantity = 0;

    if (orderBtn) {
      orderBtn.disabled = true;
    }

    buttons[0].addEventListener('click', () => {
      if (quantity > 0) quantity--;
      display.textContent = quantity;
      orderBtn.disabled = quantity === 0;
    });

    buttons[1].addEventListener('click', () => {
      quantity++;
      display.textContent = quantity;
      orderBtn.disabled = quantity === 0;
    });

    orderBtn.addEventListener('click', () => {
      if (!isUserLoggedIn()) {
        alert('Please log in before placing an order.');
        window.location.href = 'login.html';
        return;
      }

      if (quantity > 0) {
        alert(`Added ${quantity}x ${itemName} to your cart!`);
      }
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
