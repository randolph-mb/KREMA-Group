// Newsletter form handler (simulated)
function handleNewsletter(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  if (!emailInput) return;

  const email = emailInput.value;

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    return;
  }

  // Simulate successful signup
  alert(`Vielen Dank! Sie wurden erfolgreich mit der E-Mail ${email} für unseren Newsletter angemeldet.`);

  // Clear form
  form.reset();
}

// Helper function to show/hide field errors for the contact form
function showFieldError(fieldId, message) {
  const errorDiv = document.getElementById(`${fieldId}-error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }
  const inputField = document.getElementById(fieldId);
  if (inputField) {
    inputField.classList.add('border-red-500', 'focus:border-red-500');
    inputField.classList.remove('focus:border-accent-color');
  }
}

// Helper function to clear a single field error
function clearFieldError(fieldId) {
  const errorDiv = document.getElementById(`${fieldId}-error`);
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }
  const inputField = document.getElementById(fieldId);
  if (inputField) {
    inputField.classList.remove('border-red-500', 'focus:border-red-500');
    inputField.classList.add('focus:border-accent-color');
  }
}

// Helper function to clear all contact form errors
function clearAllContactErrors() {
  const fields = ['name', 'email', 'message', 'privacy'];
  fields.forEach(clearFieldError);
}

// Contact Form Submission Handler with AJAX to Formspree
async function handleContactFormSubmit(event) {
  event.preventDefault();
  clearAllContactErrors();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const submitButtonText = document.getElementById('submit-text');
  const submitButtonLoading = document.getElementById('submit-loading');
  const successMessageDiv = document.getElementById('success-message');

  // Client-Side Validation
  let isValid = true;
  const nameField = form.name;
  const emailField = form.email;
  const messageField = form.message;
  const privacyField = form.privacy;

  const name = nameField ? nameField.value.trim() : '';
  const email = emailField ? emailField.value.trim() : '';
  const message = messageField ? messageField.value.trim() : '';
  const privacy = privacyField ? privacyField.checked : false;

  if (nameField && !name) {
    showFieldError('name', 'Bitte geben Sie Ihren Namen ein.');
    isValid = false;
  }
  if (emailField && !email) {
    showFieldError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
    isValid = false;
  } else if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    isValid = false;
  }
  if (messageField && !message) {
    showFieldError('message', 'Bitte geben Sie Ihre Nachricht ein.');
    isValid = false;
  }
  if (privacyField && !privacy) {
    showFieldError('privacy', 'Sie müssen der Datenschutzerklärung zustimmen.');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Prepare for submission
  if (submitButton) submitButton.disabled = true;
  if (submitButtonText) submitButtonText.classList.add('hidden');
  if (submitButtonLoading) submitButtonLoading.classList.remove('hidden');
  if (successMessageDiv) successMessageDiv.classList.add('hidden');

  try {
    // Create FormData from the form
    const formData = new FormData(form);
    
    // Send to Formspree via AJAX
    const response = await fetch('https://formspree.io/f/mjkrkyaq', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success - show custom success message
      if (successMessageDiv) {
        successMessageDiv.classList.remove('hidden');
        successMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      clearAllContactErrors();
    } else {
      // Handle Formspree validation errors
      const data = await response.json();
      if (data.errors) {
        // Display Formspree field errors
        data.errors.forEach(error => {
          if (error.field && document.getElementById(error.field)) {
            showFieldError(error.field, error.message);
          } else {
            showFieldError('message', error.message || 'Ein Fehler ist aufgetreten.');
          }
        });
      } else {
        showFieldError('message', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showFieldError('message', 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
  } finally {
    // Reset button state
    if (submitButton) submitButton.disabled = false;
    if (submitButtonText) submitButtonText.classList.remove('hidden');
    if (submitButtonLoading) submitButtonLoading.classList.add('hidden');
  }
}

// Funktion zum Anpassen der Hero-Section-Höhe
function adjustHeroSectionHeight() {
  const header = document.getElementById('site-header'); // Ensure this ID exists in your HTML
  const heroSection = document.getElementById('hero-section'); // Ensure this ID exists
  const contactForm = document.getElementById('contact-form'); // Check if this is the contact page

  if (header && heroSection) {
    // Skip full-height adjustment on contact page
    if (contactForm) {
      // Contact page: don't apply minHeight adjustment, let natural height prevail
      heroSection.style.minHeight = '';
      return;
    }
    
    const headerHeight = header.offsetHeight;
    // Use minHeight for flexibility, ensures content below isn't cut off if hero content is taller
    heroSection.style.minHeight = `calc(100vh - ${headerHeight}px)`;
  } else {
    if (!header) console.warn('Header-Element mit ID "site-header" nicht gefunden für adjustHeroSectionHeight.');
    if (!heroSection) console.warn('Hero-Section-Element mit ID "hero-section" nicht gefunden für adjustHeroSectionHeight.');
  }
}

// Function to reveal hero content after page load
function revealHeroContent() {
  // This depends on your CSS. If 'hero-image-loaded' triggers an animation/transition.
  document.body.classList.add('hero-image-loaded');
}

// Main DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
  // Conditional Hero section setup
  const siteHeaderForHero = document.getElementById('site-header');
  const heroSectionToAdjust = document.getElementById('hero-section');
  if (siteHeaderForHero && heroSectionToAdjust) {
    adjustHeroSectionHeight();
    revealHeroContent(); // Assuming revealHeroContent is tied to hero section presence
  } else {
      // If no hero section, you might still want to reveal other body content
      // For example, if 'hero-image-loaded' has general page reveal effects:
      // revealHeroContent();
  }

  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      // Optional: Re-adjust hero if menu toggle affects layout significantly
      // and if hero section exists on this page.
      if (siteHeaderForHero && heroSectionToAdjust) {
          setTimeout(adjustHeroSectionHeight, 50); // Small delay for menu animation
      }
    });
  }

  

  // Contact Form setup with AJAX submission to Formspree
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }

  // Newsletter Form setup (if you have a dedicated newsletter form with this ID)
  const newsletterForm = document.getElementById('newsletter-form'); // Assuming an ID for a newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletter);
  }


  // Project filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Update active button styling (using Tailwind classes for example)
        filterButtons.forEach(btn => {
          btn.classList.remove('bg-accent-color', 'text-white', 'font-semibold'); // Example active classes
          btn.classList.add('bg-gray-200', 'text-gray-700'); // Example inactive classes
        });
        this.classList.add('bg-accent-color', 'text-white', 'font-semibold');
        this.classList.remove('bg-gray-200', 'text-gray-700');

        // Filter projects with smoother transition
        projectItems.forEach(item => {
          item.classList.add('transition-opacity', 'duration-300', 'ease-in-out');
          const itemCategory = item.getAttribute('data-category');

          if (filter === 'all' || itemCategory === filter) {
            item.style.display = 'block';
            // Force reflow/repaint before applying opacity to ensure transition works
            // void item.offsetWidth; // One way to force reflow
            setTimeout(() => {
              item.style.opacity = '1';
            }, 10); // Small delay to ensure display:block is rendered
          } else {
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // Match opacity transition duration
          }
        });
      });
    });
    // Optional: Set the first filter button as active by default if needed
    // if (filterButtons[0]) filterButtons[0].click();
  }
});

// Window resize listener
window.addEventListener('resize', function() {
  // Conditionally adjust hero section height on resize
  const siteHeaderForHero = document.getElementById('site-header');
  const heroSectionToAdjust = document.getElementById('hero-section');
  if (siteHeaderForHero && heroSectionToAdjust) {
    adjustHeroSectionHeight();
  }
});

// Testimonial Slider Logik
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.getElementById('next-testimonial');
  const prevBtn = document.getElementById('prev-testimonial');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Alle Slides ausblenden
    slides.forEach((slide, i) => {
      slide.classList.add('opacity-0', 'hidden');
      slide.classList.remove('animate-fade-in');
    });

    // Den gewünschten Slide einblenden
    const slide = slides[index];
    slide.classList.remove('hidden');
    // Kurze Verzögerung, damit die CSS-Animation korrekt ausgelöst wird
    setTimeout(() => {
      slide.classList.remove('opacity-0');
      slide.classList.add('animate-fade-in');
    }, 10);

    currentSlide = index;
  }

  function nextSlide() {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  // Automatisches Wechseln starten
  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 7000); // Wechselt alle 7 Sekunden
  }

  // Automatisches Wechseln stoppen und neu starten (wenn der User klickt)
  function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  // Event Listeners für die Pfeile
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetSlideShow();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetSlideShow();
    });
  }

  // Initialisierung
  if (slides.length > 0) {
    showSlide(0);
    startSlideShow();
  }
});