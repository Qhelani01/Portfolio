document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.9)';
      navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.8)';
      navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
    }
  });

  // Scroll Progress Indicator
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // Active Section Tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Simple scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  document.querySelectorAll('.section-title, .about-content, .project-card, .contact-card, .photo-card, .photography-intro').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Project card click handling - make entire card clickable
  document.querySelectorAll('.project-card').forEach(card => {
    const projectUrl = card.getAttribute('data-project-url');
    
    if (projectUrl) {
      // Make entire card clickable
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking on the "View Code" link
        if (e.target.closest('.project-link[href]')) {
          return;
        }
        window.open(projectUrl, '_blank');
      });
    }
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Photography gallery interactions
  document.querySelectorAll('.photo-card').forEach(card => {
    // Enhanced hover effects for photo cards
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });

    // Click to expand photo story (optional feature)
    card.addEventListener('click', () => {
      const overlay = card.querySelector('.photo-overlay');
      const story = card.querySelector('.photo-story');
      
      if (overlay && story) {
        // Toggle full story view
        if (story.style.maxHeight === 'none') {
          story.style.maxHeight = '120px';
          story.style.webkitLineClamp = '5';
        } else {
          story.style.maxHeight = 'none';
          story.style.webkitLineClamp = 'none';
        }
      }
    });
  });

  // Staggered animation for photo cards
  const photoCards = document.querySelectorAll('.photo-card');
  photoCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Dynamic copyright year
  const footer = document.querySelector("footer p");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} Qhelani Moyo. All rights reserved.`;
  }

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Add CSS for loading animation
  const style = document.createElement('style');
  style.textContent = `
    body {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    body.loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
});

// Loading indicator
function initLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (loadingIndicator) {
        // Hide loading indicator when page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingIndicator.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingIndicator.remove();
                }, 500);
            }, 1000); // Show for at least 1 second
        });
    }
}

// Initialize loading indicator
document.addEventListener('DOMContentLoaded', initLoadingIndicator);

// Typing Animation
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Optional: Add cursor blink effect
      element.innerHTML = text + '<span class="cursor">|</span>';
    }
  }
  
  type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const texts = ['Software Engineer', 'AI Engineer', 'ML Engineer', 'Full-Stack Developer'];
    let currentIndex = 0;
    
    function typeNext() {
      typeWriter(typingText, texts[currentIndex], 80);
      currentIndex = (currentIndex + 1) % texts.length;
      setTimeout(typeNext, texts[currentIndex].length * 80 + 2000);
    }
    
    // Start after a short delay
    setTimeout(() => {
      typeNext();
    }, 1000);
  }
});
