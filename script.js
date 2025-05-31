
// Newsletter form handler
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

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      // Optional: Hero-Section nach Menü-Toggle neu anpassen
      setTimeout(adjustHeroSectionHeight, 50);
    });
  }

  // Project filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter projects
        projectItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 100);
          } else {
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});

// Funktion zum Anpassen der Hero-Section-Höhe
function adjustHeroSectionHeight() {
  const header = document.getElementById('site-header');
  const heroSection = document.getElementById('hero-section');

  if (header && heroSection) {
    const headerHeight = header.offsetHeight;
    // Setze die Höhe der Hero-Section auf den verbleibenden Viewport-Bereich
    heroSection.style.height = `calc(100vh - ${headerHeight}px)`;
  } else {
    // Debugging-Ausgaben
    if (!header) console.error('Header-Element mit ID "site-header" nicht gefunden.');
    if (!heroSection) console.error('Hero-Section-Element mit ID "hero-section" nicht gefunden.');
  }
}

// Function to reveal hero content after page load
function revealHeroContent() {
  document.body.classList.add('hero-image-loaded');
}

// Execute adjustments on load and window resize
window.addEventListener('load', function() {
  adjustHeroSectionHeight();
  revealHeroContent();
});

window.addEventListener('resize', function() {
  adjustHeroSectionHeight();
});
