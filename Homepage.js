// Homepage.js
  
  // Navbar scroll effect - adds glassmorphism when scrolling
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Section reveal animation using Intersection Observer
  const sections = document.querySelectorAll('.section-hidden');
  
  const revealSection = function(entries, observer) {
    const [entry] = entries;
    
    // If section is not intersecting, return early
    if (!entry.isIntersecting) return;
    
    // Add visible class to trigger animation
    entry.target.classList.add('section-visible');
    observer.unobserve(entry.target);
  };
  
  // Create Intersection Observer for section animations
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });
  
  // Observe each section for animation
  sections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.remove('section-hidden'); // Remove hidden class to enable animation
  });

  // Contact form submission handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }
// Smooth scroll to section function
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ 
    behavior: 'smooth' 
  });
}