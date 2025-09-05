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
      navbar.style.background = 'rgba(250, 250, 250, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(139, 115, 85, 0.1)';
    } else {
      navbar.style.background = 'rgba(250, 250, 250, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

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

  // Simple hover effects for project cards
  document.querySelectorAll('.project-card').forEach(card => {
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
