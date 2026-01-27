// Dark Mode Toggle - Initialize immediately (before DOM ready)
(function() {
  const html = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
})();

// Throttle function for scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle
  function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    
    if (darkModeToggle && themeIcon) {
      // Set initial icon
      const currentTheme = html.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
      
      darkModeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      });
    }
  }

  initDarkMode();

  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
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
  }

  // Smooth scroll for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Combined scroll handler with throttling
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Navbar background
    if (navbar) {
      if (scrollY > 100) {
        if (currentTheme === 'dark') {
          navbar.style.background = 'rgba(45, 45, 47, 0.9)';
          navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.3)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.9)';
          navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.08)';
        }
      } else {
        if (currentTheme === 'dark') {
          navbar.style.background = 'rgba(45, 45, 47, 0.8)';
          navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.2)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.8)';
          navbar.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
        }
      }
    }

    // Scroll progress
    if (scrollProgress) {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollY / windowHeight) * 100;
      scrollProgress.style.width = scrolled + '%';
    }

    // Back to top button
    if (backToTop) {
      backToTop.style.display = scrollY > 200 ? 'flex' : 'none';
    }

    // Active section tracking
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 10); // Throttle to 10ms

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Back to top button click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Intersection Observer for animations
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

  // Project card click handling
  document.querySelectorAll('.project-card').forEach(card => {
    const projectUrl = card.getAttribute('data-project-url');
    
    if (projectUrl) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-link[href]')) {
          return;
        }
        window.open(projectUrl, '_blank');
      });
    }
  });

  // Photography gallery overlay expand/collapse
  document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const overlay = card.querySelector('.photo-overlay');
      const story = card.querySelector('.photo-story');
      if (overlay && story) {
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

  // Dynamic copyright year
  const footer = document.querySelector("footer p");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} Qhelani Moyo. All rights reserved.`;
  }
});

// Loading indicator - optimized
function initLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  
  if (loadingIndicator) {
    if (document.readyState === 'complete') {
      loadingIndicator.classList.add('hidden');
      setTimeout(() => loadingIndicator.remove(), 300);
    } else {
      window.addEventListener('load', () => {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => loadingIndicator.remove(), 300);
      }, { once: true });
    }
  }
}

// Initialize loading indicator immediately
initLoadingIndicator();

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
    
    setTimeout(() => {
      typeNext();
    }, 500); // Reduced delay
  }
});
