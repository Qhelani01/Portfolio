// Blog System JavaScript

// Calculate reading time
function calculateReadingTime() {
  const article = document.querySelector('.blog-post-body');
  if (!article) return;

  const text = article.innerText || article.textContent;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);

  const readingTimeElement = document.getElementById('reading-time');
  if (readingTimeElement) {
    readingTimeElement.textContent = `${readingTime} min read`;
  }
}

// Photo Gallery Lightbox
function initPhotoGallery() {
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightboxModal = document.createElement('div');
  lightboxModal.className = 'lightbox-modal';
  lightboxModal.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">
      <i class="fas fa-times"></i>
    </button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
      <i class="fas fa-chevron-left"></i>
    </button>
    <button class="lightbox-nav lightbox-next" aria-label="Next image">
      <i class="fas fa-chevron-right"></i>
    </button>
    <div class="lightbox-content">
      <img class="lightbox-img" src="" alt="">
    </div>
  `;
  document.body.appendChild(lightboxModal);

  let currentImageIndex = 0;
  const images = Array.from(galleryImages);

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const img = lightboxModal.querySelector('.lightbox-img');
    if (images[currentImageIndex]) {
      img.src = images[currentImageIndex].src;
      img.alt = images[currentImageIndex].alt;
    }
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // Attach click handlers to gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
    img.style.cursor = 'pointer';
  });

  // Lightbox controls
  lightboxModal.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightboxModal.querySelector('.lightbox-next').addEventListener('click', nextImage);
  lightboxModal.querySelector('.lightbox-prev').addEventListener('click', prevImage);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    } else if (e.key === 'ArrowRight' && lightboxModal.classList.contains('active')) {
      nextImage();
    } else if (e.key === 'ArrowLeft' && lightboxModal.classList.contains('active')) {
      prevImage();
    }
  });

  // Close on background click
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
}

// Load Related Posts
async function loadRelatedPosts() {
  const container = document.getElementById('related-posts-container');
  if (!container) return;

  // Get current post ID from URL
  const currentPath = window.location.pathname;
  const currentSlug = currentPath.split('/').pop() || currentPath.split('\\').pop();
  
  try {
    const response = await fetch('../blog-data.json');
    const data = await response.json();
    
    // Find current post
    const currentPost = data.posts.find(post => post.slug === currentSlug);
    if (!currentPost || !currentPost.relatedPosts) return;

    // Get related posts
    const relatedPosts = currentPost.relatedPosts
      .map(id => data.posts.find(post => post.id === id))
      .filter(post => post !== undefined)
      .slice(0, 3);

    if (relatedPosts.length === 0) {
      // Show other recent posts if no related posts
      const otherPosts = data.posts
        .filter(post => post.id !== currentPost.id)
        .slice(0, 3);
      displayRelatedPosts(otherPosts, container);
    } else {
      displayRelatedPosts(relatedPosts, container);
    }
  } catch (error) {
    console.error('Error loading related posts:', error);
  }
}

function displayRelatedPosts(posts, container) {
  container.innerHTML = posts.map(post => {
    // Add ../ prefix for blog posts (they're in blog-posts/ folder)
    const imagePath = post.featuredImage.startsWith('../') 
      ? post.featuredImage 
      : '../' + post.featuredImage;
    return `
    <a href="${post.slug}" class="related-post-card">
      <img src="${imagePath}" alt="${post.title}" class="related-post-image" loading="lazy">
      <div class="related-post-content">
        <h3 class="related-post-title">${post.title}</h3>
        <p class="related-post-excerpt">${post.excerpt}</p>
        <div class="related-post-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${post.location}</span>
          <span><i class="fas fa-clock"></i> ${post.readingTime} min read</span>
        </div>
      </div>
    </a>
  `;
  }).join('');
}

// Social Sharing
function initSocialSharing() {
  const shareButtons = document.querySelectorAll('.share-btn');
  const currentUrl = window.location.href;
  const currentTitle = document.querySelector('.blog-post-hero-title')?.textContent || document.title;

  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const platform = button.getAttribute('data-platform');

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`,
            '_blank',
            'width=550,height=420'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
            '_blank',
            'width=550,height=420'
          );
          break;
        case 'copy':
          navigator.clipboard.writeText(currentUrl).then(() => {
            // Show feedback
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = 'var(--accent-color)';
            setTimeout(() => {
              button.innerHTML = originalHTML;
              button.style.color = '';
            }, 2000);
          });
          break;
      }
    });
  });
}

// Initialize blog functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  calculateReadingTime();
  initPhotoGallery();
  loadRelatedPosts();
  initSocialSharing();
});
