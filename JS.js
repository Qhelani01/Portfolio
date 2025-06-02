// Smooth scroll for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Back to Top Button
const backToTop = document.createElement('button');
backToTop.textContent = '↑ Top';
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

// Dynamic copyright year
const footer = document.querySelector("footer p");
if (footer) {
  const year = new Date().getFullYear();
  footer.innerHTML = `&copy; ${year} Qhelani Moyo. All rights reserved.`;
}