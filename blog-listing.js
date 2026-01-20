// Blog Listing Page JavaScript

let allPosts = [];
let filteredPosts = [];

// Load blog posts from JSON
async function loadBlogPosts() {
  try {
    const response = await fetch('blog-data.json');
    const data = await response.json();
    allPosts = data.posts;
    filteredPosts = [...allPosts];
    
    // Load categories
    loadCategories(data.categories);
    
    // Render posts
    renderPosts();
  } catch (error) {
    console.error('Error loading blog posts:', error);
    // Fallback: show error message
    document.getElementById('blog-grid').innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>Unable to load blog posts. Please try again later.</p>
      </div>
    `;
  }
}

// Load categories into filter
function loadCategories(categories) {
  const filterContainer = document.getElementById('category-filter');
  if (!filterContainer || !categories) return;

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.setAttribute('data-category', category.name.toLowerCase());
    button.textContent = category.name;
    button.addEventListener('click', () => filterByCategory(category.name.toLowerCase()));
    filterContainer.appendChild(button);
  });
}

// Filter posts by category
function filterByCategory(category) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-category') === category || 
        (category === 'all' && btn.textContent === 'All Stories')) {
      btn.classList.add('active');
    }
  });

  if (category === 'all') {
    filteredPosts = [...allPosts];
  } else {
    filteredPosts = allPosts.filter(post => 
      post.categories.some(cat => cat.toLowerCase() === category)
    );
  }

  renderPosts();
}

// Render blog posts
function renderPosts() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  if (filteredPosts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>No posts found in this category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredPosts.map(post => `
    <a href="blog-posts/${post.slug}" class="blog-post-card">
      <div class="blog-post-card-image">
        <img src="${post.featuredImage}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-post-card-content">
        <div class="blog-post-card-meta">
          <span class="blog-post-card-location">
            <i class="fas fa-map-marker-alt"></i>
            ${post.location}
          </span>
          <span class="blog-post-card-date">
            <i class="fas fa-calendar"></i>
            ${post.date}
          </span>
        </div>
        <div class="blog-post-card-categories">
          ${post.categories.map(cat => `<span class="blog-post-card-category">${cat}</span>`).join('')}
        </div>
        <h3 class="blog-post-card-title">${post.title}</h3>
        <p class="blog-post-card-excerpt">${post.excerpt}</p>
        <div class="blog-post-card-footer">
          <span class="blog-post-card-read-time">
            <i class="fas fa-clock"></i>
            ${post.readingTime} min read
          </span>
          <span class="blog-post-card-link">
            Read Full Story
            <i class="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>
    </a>
  `).join('');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();
  
  // Set "All Stories" as active by default
  const allBtn = document.querySelector('.filter-btn[data-category="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
  }
});
