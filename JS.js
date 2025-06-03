document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Back to Top Button
  const backToTop = document.createElement('button');
  backToTop.textContent = '↑ Top';
  backToTop.setAttribute('aria-label', 'Scroll to top');
  backToTop.style.position = 'fixed';
  backToTop.style.bottom = '20px';
  backToTop.style.right = '20px';
  backToTop.style.padding = '10px';
  backToTop.style.display = 'none';
  backToTop.style.zIndex = '1000';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  // Dynamic copyright
  const footer = document.querySelector("footer p");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} Qhelani Moyo. All rights reserved.`;
  }
<<<<<<< HEAD
});
=======
});
>>>>>>> fbe854fb32275844e996da3b2107c3f89d06b0c1
