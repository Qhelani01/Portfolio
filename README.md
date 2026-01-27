# 💼 Qhelani Moyo | Portfolio

A modern, responsive portfolio website showcasing my work as a Software Engineer & AI Engineer. Built with clean, Apple-inspired design principles and with a content-driven photography section and Felix Rome–style location gallery.

---

## 🎨 Design & Features

### Theme & Styling
- **Apple-Style Design** - Clean, minimal aesthetic with light theme as default
- **Muted Moss Accent** - Custom color scheme (#595f39) for a natural, professional look
- **Dark Mode Toggle** - Persistent theme switching with localStorage
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Scroll-triggered animations and hover effects
- **Professional Typography** - Inter font family with Fira Code for code snippets

### Interactive Features
- **Typing Animation** - Dynamic hero section with rotating titles (Software Engineer, AI Engineer, ML Engineer, Full-Stack Developer)
- **Scroll Progress Indicator** - Visual progress bar at the top of the page
- **Smooth Scrolling** - Seamless navigation between sections
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Back to Top Button** - Quick navigation to page top
- **Loading Indicator** - Smooth page load animation
- **Clickable Project Cards** - Entire project cards link to live demos
- **Active Section Tracking** - Navigation highlights current section

### Photography
- **Through My Lens (homepage)** - Six photo cards with hover overlays; content from `content.json`
- **Explore More page** - Felix Rome–style location gallery (United States, Botswana, Zimbabwe) with hero, tabs, and 4-per-row grid; content from `content.json`
- **Content-driven** - Photography page and homepage cards load from `content.json`; add images and edit one file to update the site

### Performance Optimizations
- **Resource Preloading** - Critical CSS and JavaScript preloaded
- **Optimized Font Loading** - Google Fonts with display=swap
- **Throttled Scroll Events** - Efficient scroll handling
- **Passive Event Listeners** - Improved scroll performance
- **Async Font Awesome** - Non-blocking icon loading
- **Service Worker Support** - PWA-ready architecture

---

## 🛠️ Technologies

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with CSS Variables, Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Interactive features, animations, and dynamic content
- **Font Awesome 6.0** - Icons for UI elements and social links
- **Google Fonts** - Inter and Fira Code font families
- **JSON** - Content for photography and Through My Lens cards (`content.json`)

---

## 📁 Project Structure

```
Portfolio/
├── index.html              # Main portfolio page
├── photography.html        # Felix Rome–style photography gallery (Explore More)
├── content.json            # Content source: photography locations + Through My Lens cards
├── CSS.css                 # Global stylesheet
├── JS.js                   # Main JavaScript (includes Through My Lens loader)
├── photography.js          # Photography page: location switching, grid from content
├── sw.js                   # Service worker
├── IMG_9375.jpg            # Profile image
├── photos/                 # Photography assets
│   ├── united-states/      # Hero + 1.jpg … 8.jpg for Photography page
│   ├── botswana/
│   ├── zimbabwe/
│   └── *.jpg               # Through My Lens cards (e.g. seattle-sunset.jpg)
└── README.md               # This file
```

---

## 🎯 Projects Showcased

### Campus Climb
- **Tech**: Python, Flask, PostgreSQL, HTML, CSS, JavaScript
- **Description**: Full-stack web application centralizing student opportunities for WVSU
- **Highlights**: 95% user satisfaction, 800+ records, <200ms query times
- **Live Demo**: [campus-climb.vercel.app](https://campus-climb.vercel.app/)
- **GitHub**: [View Code](https://github.com/Qhelani01)

### Phish Guardian
- **Tech**: JavaScript, Node.js, REST APIs, VirusTotal API
- **Description**: Real-time phishing detection application with instant threat analysis
- **Highlights**: 35% backend logic reduction, secure authentication
- **Live Demo**: [phish-guardian-nine.vercel.app](https://phish-guardian-nine.vercel.app/)
- **GitHub**: [View Code](https://github.com/Qhelani01)

### Flycatcher App
- **Tech**: Python, Flask, Google Maps API, eBird API
- **Description**: Bird migration analytics tool with interactive visualizations
- **Highlights**: 1,000+ observations, 40% page load time improvement with caching
- **Live Demo**: [flycatcher-web-app.onrender.com](https://flycatcher-web-app.onrender.com/)
- **GitHub**: [View Code](https://github.com/Qhelani01)

---

## 🌟 Skills Highlighted

### Languages
- Python, Java, C++, JavaScript, HTML, CSS, Swift, SQL

### Core Skills
- AI Integration, Prompt Engineering, SQL Optimization, Model Benchmarking, Data Pipelines

### Tools & Frameworks
- Git, Node.js, Tailwind CSS, PyTorch, Flask, PostgreSQL

### Web & Cloud
- REST APIs, AWS

---

## 📸 Adding Content

All photography content (Photography page + homepage Through My Lens cards) is driven by **`content.json`**. To add or change images and copy:

1. **Photography page** (United States / Botswana / Zimbabwe)
   - Put images in `photos/united-states/`, `photos/botswana/`, `photos/zimbabwe/`:
     - `hero.jpg` — landscape hero for that location
     - `1.jpg` … `8.jpg` — grid images (4 per row)
   - Edit `content.json` → `photography.locations[]`: set `hero` and `images` to those paths (e.g. `photos/united-states/hero.jpg`, `photos/united-states/1.jpg`, …).

2. **Through My Lens** (six cards on the homepage)
   - Add or replace images in `photos/` (e.g. `seattle-sunset.jpg`).
   - Edit `content.json` → `throughMyLens[]`: each item has `image`, `title`, `story`, `location`, `date`. Add, remove, or reorder entries to change the cards.

No HTML or JS edits are needed—only `content.json` and the image files.

---

## 🔗 Connect

- **GitHub**: [Qhelani01](https://github.com/Qhelani01)
- **LinkedIn**: [qhelani-moyo](https://linkedin.com/in/qhelani-moyo)
- **Instagram**: [@qhelani_moyo](https://www.instagram.com/qhelani_moyo/)
- **Email**: qhelanimoyoe@gmail.com

---

## 🚀 Getting Started

1. Clone the repository or download the files
2. Open `index.html` in your web browser
3. Explore sections using the navigation menu
4. Click project cards to view live demos
5. Use “Explore More” in Through My Lens to open the location gallery
6. Toggle dark mode using the moon/sun icon

### Local Development

Simply open `index.html` in a modern web browser. No build process required.

To add or update photography content, edit `content.json` and add image files under `photos/` (see **Adding Content** above). The site loads `content.json` at runtime.

---

## 🎨 Design Philosophy

This portfolio follows Apple-inspired design principles:
- **Clarity** - Clean, uncluttered layouts
- **Consistency** - Unified design language throughout
- **Depth** - Subtle shadows and layering
- **Accessibility** - Semantic HTML and ARIA labels
- **Performance** - Optimized loading and smooth interactions

---

**Built with ❤️ by Qhelani Moyo** | *January 2025*
