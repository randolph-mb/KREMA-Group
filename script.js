// Newsletter form handler (dummy function)
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  
  // Simulate successful signup
  alert(`Vielen Dank! Sie wurden erfolgreich mit der E-Mail ${email} für unseren Newsletter angemeldet.`);
  
  // Clear form
  event.target.reset();
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

// Mobile menu functionality (if not already implemented)
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
});