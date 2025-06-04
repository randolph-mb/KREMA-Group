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
    inputField.classList.add('border-red-500', 'focus:border-red-500'); // Add error border
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

// Contact Form Submission Handler
async function handleContactFormSubmit(event) {
  event.preventDefault();
  clearAllContactErrors(); // Clear previous errors

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const submitButtonText = document.getElementById('submit-text');
  const submitButtonLoading = document.getElementById('submit-loading');
  const successMessageDiv = document.getElementById('success-message');

  // --- 1. Client-Side Validation ---
  let isValid = true;
  const nameField = form.name;
  const emailField = form.email;
  const phoneField = form.phone;
  const serviceField = form.service;
  const messageField = form.message;
  const privacyField = form.privacy;
  const newsletterField = form.newsletter;

  const name = nameField ? nameField.value.trim() : '';
  const email = emailField ? emailField.value.trim() : '';
  const phone = phoneField ? phoneField.value.trim() : '';
  const service = serviceField ? serviceField.value : '';
  const message = messageField ? messageField.value.trim() : '';
  const privacy = privacyField ? privacyField.checked : false;
  const newsletter = newsletterField ? newsletterField.checked : false;


  if (nameField && !name) {
    showFieldError('name', 'Bitte geben Sie Ihren Namen ein.');
    isValid = false;
  }
  if (emailField && !email) {
    showFieldError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
    isValid = false;
  } else if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email regex
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
    return; // Stop if validation fails
  }

  // --- 2. Prepare for Submission ---
  if (submitButton) submitButton.disabled = true;
  if (submitButtonText) submitButtonText.classList.add('hidden');
  if (submitButtonLoading) submitButtonLoading.classList.remove('hidden');
  if (successMessageDiv) successMessageDiv.classList.add('hidden'); // Hide previous success

  const formData = {
    name,
    email,
    phone,
    service,
    message,
    newsletterOptIn: newsletter,
    // TODO: Add CSRF token here if your backend requires it
    // csrfToken: document.querySelector('meta[name="csrf-token"]')?.content
  };

  // --- 3. Send Data to Server (AJAX/Fetch) ---
  try {
    // IMPORTANT: Replace '/api/contact' with your actual backend endpoint URL
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'X-CSRF-Token': formData.csrfToken // Example for CSRF
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      if (successMessageDiv) successMessageDiv.classList.remove('hidden');
      form.reset();
      clearAllContactErrors();
    } else {
      // Handle server-side validation errors or other issues
      if (result.errors) {
        for (const field in result.errors) {
          // Ensure the field ID exists before trying to show an error
          if (document.getElementById(field)) {
            showFieldError(field, result.errors[field]);
          } else {
            // Fallback for general errors not tied to a specific field, or if field ID is wrong
            showFieldError('message', `${field}: ${result.errors[field]}`);
          }
        }
      } else {
        // Generic error from server or unexpected format
        showFieldError('message', result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showFieldError('message', 'Netzwerkfehler oder Server nicht erreichbar. Bitte versuchen Sie es später erneut.');
  } finally {
    // --- 4. Reset Button State ---
    if (submitButton) submitButton.disabled = false;
    if (submitButtonText) submitButtonText.classList.remove('hidden');
    if (submitButtonLoading) submitButtonLoading.classList.add('hidden');
  }
}


// Funktion zum Anpassen der Hero-Section-Höhe
function adjustHeroSectionHeight() {
  const header = document.getElementById('site-header'); // Ensure this ID exists in your HTML
  const heroSection = document.getElementById('hero-section'); // Ensure this ID exists

  if (header && heroSection) {
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

  // Contact Form setup
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