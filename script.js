
// Funktion zum Anpassen des Paddings des Hero-Inhalts
function adjustHeroContentPadding() {
  const header = document.getElementById('site-header');
  const heroContentLayer = document.getElementById('hero-content-layer');

  if (header && heroContentLayer) {
    const headerHeight = header.offsetHeight;
    // Wichtig: Wir setzen das Padding-Top des Content-Layers,
    // NICHT der gesamten Section.
    heroContentLayer.style.paddingTop = `${headerHeight}px`;

    // Die `h-full` Klasse auf heroContentLayer und die Flexbox-Zentrierung
    // (items-center justify-center) sorgen dafür, dass der Inhalt
    // sich im verbleibenden Raum korrekt zentriert.
    // Wir müssen auch die Gesamthöhe des heroContentLayer so anpassen,
    // dass sie 100vh MINUS Header-Höhe beträgt, damit die untere Kante
    // des sichtbaren Inhalts mit der Viewport-Kante abschließt.
    // Alternativ kann man das padding-bottom ebenfalls setzen, aber das
    // kann zu Problemen führen, wenn der Inhalt selbst sehr hoch ist.
    // Eine bessere Methode ist, dem Content Layer zu sagen, dass seine maximale Höhe
    // dem verfügbaren Platz entspricht.
    // Aber da wir flexbox für die Zentrierung nutzen, reicht das padding-top
    // um den Startpunkt des Inhalts zu verschieben. Die section selbst
    // bleibt h-screen.
  }
}

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

// Führe die Anpassung beim Laden und bei Größenänderung des Fensters aus
window.addEventListener('load', adjustHeroContentPadding);
window.addEventListener('resize', adjustHeroContentPadding);
