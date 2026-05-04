// =========================================
// Bolt Services CMS
// Simple JSON-based content management
// =========================================

const CONTENT_PATH = '../content/site-content.json';
let siteContent = {};
let siteImages = [];

const ICON_OPTIONS = ['clipboard', 'zap', 'cog', 'shield', 'users', 'bar-chart'];

// ---- Initialisation ----

async function init() {
  try {
    const [contentRes, imagesRes] = await Promise.all([
      fetch(CONTENT_PATH),
      fetch('/api/images').catch(() => null)
    ]);
    siteContent = await contentRes.json();
    if (imagesRes && imagesRes.ok) {
      const data = await imagesRes.json();
      siteImages = data.images || [];
    }
    renderAllSections();
    initNav();
    initSave();
  } catch (err) {
    document.getElementById('cms-main').innerHTML =
      `<p style="color:red">Error loading content: ${err.message}</p>`;
  }
}

// ---- Navigation ----

function initNav() {
  const buttons = document.querySelectorAll('.cms-nav__btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.cms-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(`section-${btn.dataset.section}`);
      if (section) section.classList.add('active');
    });
  });
}

// ---- Save ----

function initSave() {
  document.getElementById('save-btn').addEventListener('click', saveContent);
}

async function saveContent() {
  const status = document.getElementById('save-status');
  status.textContent = 'Saving...';
  status.className = 'cms-status';

  collectHero();
  collectAbout();
  collectServices();
  collectIndustries();
  collectTestimonials();
  collectContact();
  collectBlog();
  collectSocial();

  try {
    const res = await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteContent, null, 2)
    });

    if (res.ok) {
      status.textContent = 'Saved successfully!';
      status.className = 'cms-status success';
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    downloadJSON();
    status.textContent = 'Downloaded as file (no server API). Replace content/site-content.json with the downloaded file.';
    status.className = 'cms-status error';
  }

  setTimeout(() => { status.textContent = ''; }, 5000);
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(siteContent, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site-content.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Image Upload Helper ----

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  // Refresh image list
  await refreshImageList();
  return data;
}

async function deleteImage(filename) {
  const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Delete failed');
  }
  await refreshImageList();
}

async function refreshImageList() {
  try {
    const res = await fetch('/api/images');
    if (res.ok) {
      const data = await res.json();
      siteImages = data.images || [];
    }
  } catch (e) {
    // ignore
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderImageUploader(id, label, currentValue) {
  const preview = currentValue
    ? `<div class="cms-image-preview">
        <img src="../${currentValue}" alt="Preview">
        <span class="cms-image-path">${currentValue}</span>
      </div>`
    : '<div class="cms-image-preview cms-image-preview--empty">No image selected</div>';

  const imageOptions = siteImages
    .filter(img => /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(img.filename))
    .map(img => `<option value="${img.path}" ${img.path === currentValue ? 'selected' : ''}>${img.filename}</option>`)
    .join('');

  return `
    <div class="cms-field">
      <label>${label}</label>
      ${preview}
      <div class="cms-image-controls">
        <select id="${id}" class="cms-image-select" onchange="previewImageSelect('${id}')">
          <option value="">-- Select an image --</option>
          ${imageOptions}
        </select>
        <span class="cms-image-or">or</span>
        <label class="cms-upload-btn" for="${id}-upload">Upload New</label>
        <input type="file" id="${id}-upload" accept="image/*" style="display:none" onchange="handleImageUpload('${id}', this)">
      </div>
    </div>
  `;
}

window.previewImageSelect = function (id) {
  const select = document.getElementById(id);
  const field = select.closest('.cms-field');
  const preview = field.querySelector('.cms-image-preview');
  if (select.value) {
    preview.className = 'cms-image-preview';
    preview.innerHTML = `<img src="../${select.value}" alt="Preview"><span class="cms-image-path">${select.value}</span>`;
  } else {
    preview.className = 'cms-image-preview cms-image-preview--empty';
    preview.innerHTML = 'No image selected';
  }
};

window.handleImageUpload = async function (id, input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  const field = input.closest('.cms-field');
  const preview = field.querySelector('.cms-image-preview');
  preview.className = 'cms-image-preview';
  preview.innerHTML = '<span class="cms-image-path">Uploading...</span>';

  try {
    const result = await uploadImage(file);
    const select = document.getElementById(id);

    // Add new option if not already present
    const exists = Array.from(select.options).some(o => o.value === result.path);
    if (!exists) {
      const opt = document.createElement('option');
      opt.value = result.path;
      opt.textContent = result.filename;
      select.appendChild(opt);
    }
    select.value = result.path;

    preview.innerHTML = `<img src="../${result.path}" alt="Preview"><span class="cms-image-path">${result.path}</span>`;

    // Refresh the images section if visible
    const imagesSection = document.getElementById('section-images');
    if (imagesSection && imagesSection.classList.contains('active')) {
      refreshSection('images');
    }
  } catch (err) {
    preview.innerHTML = `<span class="cms-image-path" style="color:red">Upload failed: ${err.message}</span>`;
  }
};

// ---- Render All Sections ----

function renderAllSections() {
  const main = document.getElementById('cms-main');
  main.innerHTML = `
    ${renderHeroSection()}
    ${renderAboutSection()}
    ${renderServicesSection()}
    ${renderIndustriesSection()}
    ${renderTestimonialsSection()}
    ${renderContactSection()}
    ${renderBlogSection()}
    ${renderSocialSection()}
    ${renderImagesSection()}
  `;
}

// ---- Hero Section ----

function renderHeroSection() {
  const h = siteContent.hero || {};
  const m = siteContent.meta || {};
  return `
    <div class="cms-section active" id="section-hero">
      <h2>Hero Section</h2>
      ${renderImageUploader('meta-logo', 'Company Logo', m.logo || 'assets/logo.svg')}
      ${renderImageUploader('hero-bg-image', 'Background Image', h.backgroundImage || 'assets/hero-bg.jpg')}
      <div class="cms-field">
        <label>Headline</label>
        <input type="text" id="hero-headline" value="${esc(h.headline || '')}">
      </div>
      <div class="cms-field">
        <label>Subheadline</label>
        <textarea id="hero-subheadline">${esc(h.subheadline || '')}</textarea>
      </div>
      <div class="cms-field">
        <label>CTA Button Text</label>
        <input type="text" id="hero-cta-text" value="${esc(h.cta?.text || '')}">
      </div>
      <div class="cms-field">
        <label>CTA Button Link</label>
        <input type="text" id="hero-cta-href" value="${esc(h.cta?.href || '')}">
      </div>
    </div>
  `;
}

function collectHero() {
  // Save logo to meta
  if (!siteContent.meta) siteContent.meta = {};
  siteContent.meta.logo = val('meta-logo');

  siteContent.hero = {
    headline: val('hero-headline'),
    subheadline: val('hero-subheadline'),
    backgroundImage: val('hero-bg-image'),
    cta: {
      text: val('hero-cta-text'),
      href: val('hero-cta-href')
    }
  };
}

// ---- About Section ----

function renderAboutSection() {
  const a = siteContent.about || {};
  const highlights = (a.highlights || []).map((h, i) => `
    <div class="cms-list-item">
      <button class="cms-remove-btn" onclick="removeHighlight(${i})">&times;</button>
      <h3>Highlight ${i + 1}</h3>
      <div class="cms-field">
        <label>Stat</label>
        <input type="text" class="highlight-stat" value="${esc(h.stat || '')}">
      </div>
      <div class="cms-field">
        <label>Label</label>
        <input type="text" class="highlight-label" value="${esc(h.label || '')}">
      </div>
    </div>
  `).join('');

  return `
    <div class="cms-section" id="section-about">
      <h2>About Section</h2>
      <div class="cms-field">
        <label>Heading</label>
        <input type="text" id="about-heading" value="${esc(a.heading || '')}">
      </div>
      <div class="cms-field">
        <label>Intro</label>
        <textarea id="about-intro">${esc(a.intro || '')}</textarea>
      </div>
      <div class="cms-field">
        <label>Description</label>
        <textarea id="about-description">${esc(a.description || '')}</textarea>
      </div>
      <h3 style="margin: 1.5rem 0 1rem;">Highlights</h3>
      <div id="highlights-list">${highlights}</div>
      <button class="cms-add-btn" onclick="addHighlight()">+ Add Highlight</button>
    </div>
  `;
}

function collectAbout() {
  const stats = document.querySelectorAll('.highlight-stat');
  const labels = document.querySelectorAll('.highlight-label');
  const highlights = [];
  stats.forEach((s, i) => {
    highlights.push({ stat: s.value, label: labels[i].value });
  });

  siteContent.about = {
    heading: val('about-heading'),
    intro: val('about-intro'),
    description: val('about-description'),
    highlights
  };
}

window.addHighlight = function () {
  collectAbout();
  siteContent.about.highlights.push({ stat: '', label: '' });
  refreshSection('about');
};

window.removeHighlight = function (index) {
  collectAbout();
  siteContent.about.highlights.splice(index, 1);
  refreshSection('about');
};

// ---- Services Section ----

function renderServicesSection() {
  const s = siteContent.services || {};
  const items = (s.items || []).map((item, i) => {
    const iconBtns = ICON_OPTIONS.map(ic =>
      `<button type="button" class="cms-icon-option ${ic === item.icon ? 'selected' : ''}"
        onclick="selectIcon(${i}, '${ic}')" title="${ic}">${ic}</button>`
    ).join('');

    return `
      <div class="cms-list-item">
        <button class="cms-remove-btn" onclick="removeService(${i})">&times;</button>
        <h3>Service ${i + 1}</h3>
        <div class="cms-field">
          <label>Title</label>
          <input type="text" class="service-title" value="${esc(item.title || '')}">
        </div>
        <div class="cms-field">
          <label>Description</label>
          <textarea class="service-desc">${esc(item.description || '')}</textarea>
        </div>
        <div class="cms-field">
          <label>Icon</label>
          <div class="cms-icon-select" data-index="${i}">${iconBtns}</div>
          <input type="hidden" class="service-icon" value="${esc(item.icon || '')}">
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="cms-section" id="section-services">
      <h2>Services</h2>
      <div class="cms-field">
        <label>Section Heading</label>
        <input type="text" id="services-heading" value="${esc(s.heading || '')}">
      </div>
      <div class="cms-field">
        <label>Section Intro</label>
        <textarea id="services-intro">${esc(s.intro || '')}</textarea>
      </div>
      <div id="services-list">${items}</div>
      <button class="cms-add-btn" onclick="addService()">+ Add Service</button>
    </div>
  `;
}

function collectServices() {
  const titles = document.querySelectorAll('.service-title');
  const descs = document.querySelectorAll('.service-desc');
  const icons = document.querySelectorAll('.service-icon');
  const items = [];
  titles.forEach((t, i) => {
    items.push({ title: t.value, description: descs[i].value, icon: icons[i].value });
  });

  siteContent.services = {
    heading: val('services-heading'),
    intro: val('services-intro'),
    items
  };
}

window.selectIcon = function (serviceIndex, iconName) {
  const containers = document.querySelectorAll('.cms-icon-select');
  const container = containers[serviceIndex];
  if (!container) return;
  container.querySelectorAll('.cms-icon-option').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  document.querySelectorAll('.service-icon')[serviceIndex].value = iconName;
};

window.addService = function () {
  collectServices();
  siteContent.services.items.push({ title: '', description: '', icon: 'cog' });
  refreshSection('services');
};

window.removeService = function (index) {
  collectServices();
  siteContent.services.items.splice(index, 1);
  refreshSection('services');
};

// ---- Industries Section ----

function renderIndustriesSection() {
  const ind = siteContent.industries || {};
  const items = (ind.items || []).map((item, i) => `
    <div class="cms-list-item" style="padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <input type="text" class="industry-item" value="${esc(item)}" style="flex:1">
      <button class="cms-remove-btn" style="position:static; width:28px; height:28px; flex-shrink:0;" onclick="removeIndustry(${i})">&times;</button>
    </div>
  `).join('');

  return `
    <div class="cms-section" id="section-industries">
      <h2>Industries</h2>
      <div class="cms-field">
        <label>Section Heading</label>
        <input type="text" id="industries-heading" value="${esc(ind.heading || '')}">
      </div>
      <div id="industries-list">${items}</div>
      <button class="cms-add-btn" onclick="addIndustry()">+ Add Industry</button>
    </div>
  `;
}

function collectIndustries() {
  const inputs = document.querySelectorAll('.industry-item');
  const items = [];
  inputs.forEach(inp => { if (inp.value.trim()) items.push(inp.value.trim()); });
  siteContent.industries = {
    heading: val('industries-heading'),
    items
  };
}

window.addIndustry = function () {
  collectIndustries();
  siteContent.industries.items.push('');
  refreshSection('industries');
};

window.removeIndustry = function (index) {
  collectIndustries();
  siteContent.industries.items.splice(index, 1);
  refreshSection('industries');
};

// ---- Testimonials Section ----

function renderTestimonialsSection() {
  const t = siteContent.testimonials || {};
  const items = (t.items || []).map((item, i) => `
    <div class="cms-list-item">
      <button class="cms-remove-btn" onclick="removeTestimonial(${i})">&times;</button>
      <h3>Testimonial ${i + 1}</h3>
      <div class="cms-field">
        <label>Quote</label>
        <textarea class="testimonial-quote">${esc(item.quote || '')}</textarea>
      </div>
      <div class="cms-field">
        <label>Author</label>
        <input type="text" class="testimonial-author" value="${esc(item.author || '')}">
      </div>
      <div class="cms-field">
        <label>Company</label>
        <input type="text" class="testimonial-company" value="${esc(item.company || '')}">
      </div>
    </div>
  `).join('');

  return `
    <div class="cms-section" id="section-testimonials">
      <h2>Testimonials</h2>
      <div class="cms-field">
        <label>Section Heading</label>
        <input type="text" id="testimonials-heading" value="${esc(t.heading || '')}">
      </div>
      <div id="testimonials-list">${items}</div>
      <button class="cms-add-btn" onclick="addTestimonial()">+ Add Testimonial</button>
    </div>
  `;
}

function collectTestimonials() {
  const quotes = document.querySelectorAll('.testimonial-quote');
  const authors = document.querySelectorAll('.testimonial-author');
  const companies = document.querySelectorAll('.testimonial-company');
  const items = [];
  quotes.forEach((q, i) => {
    items.push({ quote: q.value, author: authors[i].value, company: companies[i].value });
  });
  siteContent.testimonials = {
    heading: val('testimonials-heading'),
    items
  };
}

window.addTestimonial = function () {
  collectTestimonials();
  siteContent.testimonials.items.push({ quote: '', author: '', company: '' });
  refreshSection('testimonials');
};

window.removeTestimonial = function (index) {
  collectTestimonials();
  siteContent.testimonials.items.splice(index, 1);
  refreshSection('testimonials');
};

// ---- Contact Section ----

function renderContactSection() {
  const c = siteContent.contact || {};
  return `
    <div class="cms-section" id="section-contact">
      <h2>Contact</h2>
      <div class="cms-field">
        <label>Heading</label>
        <input type="text" id="contact-heading" value="${esc(c.heading || '')}">
      </div>
      <div class="cms-field">
        <label>Intro Text</label>
        <textarea id="contact-intro">${esc(c.intro || '')}</textarea>
      </div>
      <div class="cms-field">
        <label>Phone</label>
        <input type="text" id="contact-phone" value="${esc(c.phone || '')}">
      </div>
      <div class="cms-field">
        <label>Email</label>
        <input type="email" id="contact-email" value="${esc(c.email || '')}">
      </div>
      <div class="cms-field">
        <label>Address</label>
        <textarea id="contact-address">${esc(c.address || '')}</textarea>
      </div>
    </div>
  `;
}

function collectContact() {
  siteContent.contact = {
    heading: val('contact-heading'),
    intro: val('contact-intro'),
    phone: val('contact-phone'),
    email: val('contact-email'),
    address: val('contact-address')
  };
}

// ---- Blog Section ----

function renderBlogSection() {
  const b = siteContent.blog || {};
  const posts = (b.posts || []).map((post, i) => `
    <div class="cms-list-item">
      <button class="cms-remove-btn" onclick="removeBlogPost(${i})">&times;</button>
      <h3>Post ${i + 1}: ${esc(post.title || 'Untitled')}</h3>
      <div class="cms-field">
        <label>Title</label>
        <input type="text" class="blog-title" value="${esc(post.title || '')}">
      </div>
      <div class="cms-field">
        <label>Date</label>
        <input type="date" class="blog-date" value="${esc(post.date || '')}">
      </div>
      <div class="cms-field">
        <label>Author</label>
        <input type="text" class="blog-author" value="${esc(post.author || '')}">
      </div>
      <div class="cms-field">
        <label>Excerpt <span style="font-weight:400; color:#999;">(shown on the blog card)</span></label>
        <textarea class="blog-excerpt" style="min-height:60px">${esc(post.excerpt || '')}</textarea>
      </div>
      <div class="cms-field">
        <label>Full Article</label>
        <textarea class="blog-body" style="min-height:200px">${esc(post.body || '')}</textarea>
      </div>
    </div>
  `).join('');

  return `
    <div class="cms-section" id="section-blog">
      <h2>Blog / News</h2>
      <div class="cms-field">
        <label>Section Heading</label>
        <input type="text" id="blog-heading" value="${esc(b.heading || '')}">
      </div>
      <div class="cms-field">
        <label>Section Intro</label>
        <textarea id="blog-intro" style="min-height:60px">${esc(b.intro || '')}</textarea>
      </div>
      <div id="blog-list">${posts}</div>
      <button class="cms-add-btn" onclick="addBlogPost()">+ Add Blog Post</button>
      <p style="font-size: 0.8125rem; color: #999; margin-top: 0.75rem;">Posts are displayed newest-first on the site. Use line breaks in the article body to separate paragraphs.</p>
    </div>
  `;
}

function generatePostId(title) {
  return (title || 'post')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
}

function collectBlog() {
  const titles = document.querySelectorAll('.blog-title');
  const dates = document.querySelectorAll('.blog-date');
  const authors = document.querySelectorAll('.blog-author');
  const excerpts = document.querySelectorAll('.blog-excerpt');
  const bodies = document.querySelectorAll('.blog-body');
  const existingPosts = (siteContent.blog && siteContent.blog.posts) || [];
  const posts = [];

  titles.forEach((t, i) => {
    const existingId = existingPosts[i] && existingPosts[i].id;
    posts.push({
      id: existingId || generatePostId(t.value),
      title: t.value,
      date: dates[i].value,
      author: authors[i].value,
      excerpt: excerpts[i].value,
      body: bodies[i].value
    });
  });

  siteContent.blog = {
    heading: val('blog-heading'),
    intro: val('blog-intro'),
    posts
  };
}

window.addBlogPost = function () {
  collectBlog();
  const today = new Date().toISOString().split('T')[0];
  siteContent.blog.posts.unshift({
    id: generatePostId('new-post'),
    title: '',
    date: today,
    author: 'Bolt Services',
    excerpt: '',
    body: ''
  });
  refreshSection('blog');
};

window.removeBlogPost = function (index) {
  if (!confirm('Delete this blog post?')) return;
  collectBlog();
  siteContent.blog.posts.splice(index, 1);
  refreshSection('blog');
};

// ---- Social Media Section ----

function renderSocialSection() {
  const s = siteContent.social || {};
  return `
    <div class="cms-section" id="section-social">
      <h2>Social Media</h2>
      <div class="cms-field">
        <label>Facebook URL</label>
        <input type="url" id="social-facebook" value="${esc(s.facebook || '')}" placeholder="https://www.facebook.com/your-page">
      </div>
      <div class="cms-field">
        <label>LinkedIn URL</label>
        <input type="url" id="social-linkedin" value="${esc(s.linkedin || '')}" placeholder="https://www.linkedin.com/company/your-company">
      </div>
      <p style="font-size: 0.8125rem; color: #999; margin-top: 0.5rem;">Leave blank to hide the icon on the site.</p>
    </div>
  `;
}

function collectSocial() {
  siteContent.social = {
    facebook: val('social-facebook'),
    linkedin: val('social-linkedin')
  };
}

// ---- Images / Media Library Section ----

function renderImagesSection() {
  const cards = siteImages.map(img => {
    const isSvg = /\.svg$/i.test(img.filename);
    const isProtected = img.filename === 'logo.svg';
    return `
      <div class="cms-image-card">
        <div class="cms-image-card__preview">
          <img src="../${img.path}" alt="${img.filename}">
        </div>
        <div class="cms-image-card__info">
          <strong>${img.filename}</strong>
          <span>${formatFileSize(img.size)}</span>
        </div>
        ${isProtected ? '' : `<button class="cms-remove-btn" onclick="handleDeleteImage('${img.filename}')" title="Delete">&times;</button>`}
      </div>
    `;
  }).join('');

  return `
    <div class="cms-section" id="section-images">
      <h2>Media Library</h2>
      <div class="cms-field">
        <label>Upload New Image</label>
        <div class="cms-upload-zone" id="upload-zone">
          <p>Drag & drop an image here, or click to browse</p>
          <p class="cms-upload-zone__hint">JPG, PNG, SVG, WebP, GIF — max 10MB</p>
          <input type="file" id="media-upload" accept="image/*" style="display:none" onchange="handleMediaUpload(this)">
        </div>
      </div>
      <div class="cms-image-grid" id="image-grid">
        ${cards || '<p style="color:#999">No images uploaded yet.</p>'}
      </div>
    </div>
  `;
}

window.handleMediaUpload = async function (input) {
  if (!input.files || !input.files[0]) return;
  const status = document.getElementById('save-status');
  status.textContent = 'Uploading...';
  status.className = 'cms-status';

  try {
    await uploadImage(input.files[0]);
    status.textContent = 'Image uploaded!';
    status.className = 'cms-status success';
    refreshSection('images');
  } catch (err) {
    status.textContent = `Upload failed: ${err.message}`;
    status.className = 'cms-status error';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
};

window.handleDeleteImage = async function (filename) {
  if (!confirm(`Delete "${filename}"?`)) return;
  const status = document.getElementById('save-status');
  try {
    await deleteImage(filename);
    status.textContent = 'Image deleted.';
    status.className = 'cms-status success';
    refreshSection('images');
  } catch (err) {
    status.textContent = `Delete failed: ${err.message}`;
    status.className = 'cms-status error';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
};

// ---- Helpers ----

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function refreshSection(sectionName) {
  const sectionEl = document.getElementById(`section-${sectionName}`);
  if (!sectionEl) return;

  const renderMap = {
    hero: renderHeroSection,
    about: renderAboutSection,
    services: renderServicesSection,
    industries: renderIndustriesSection,
    testimonials: renderTestimonialsSection,
    contact: renderContactSection,
    blog: renderBlogSection,
    social: renderSocialSection,
    images: renderImagesSection
  };

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = renderMap[sectionName]();
  const newSection = tempDiv.firstElementChild;
  newSection.classList.add('active');
  sectionEl.replaceWith(newSection);

  // Re-init drag-drop if images section
  if (sectionName === 'images') initUploadZone();
}

// ---- Drag & Drop Upload ----

function initUploadZone() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('media-upload');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('cms-upload-zone--active');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('cms-upload-zone--active');
  });

  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('cms-upload-zone--active');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Reuse the media upload handler
      const fakeInput = { files: [file] };
      await window.handleMediaUpload(fakeInput);
    }
  });
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  init().then(() => {
    // Init drag-drop after render
    setTimeout(initUploadZone, 100);
  });
});
