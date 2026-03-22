/**
 * Bolt Industrial Engineering Services
 * Headless CMS Content Renderer & UI Logic
 *
 * Fetches content from the CMS content layer (JSON) and renders all sections.
 * This approach decouples content from presentation, allowing easy migration
 * to any headless CMS (Contentful, Strapi, Sanity, etc.) by swapping the fetch URL.
 */

(function () {
  'use strict';

  // ---- SVG Icon Map ----
  const icons = {
    clipboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    cog: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
  };

  // ---- Content Fetcher ----
  // In production, replace this URL with your headless CMS API endpoint
  // e.g., Contentful: https://cdn.contentful.com/spaces/{space_id}/entries
  // e.g., Strapi: https://your-strapi.com/api/homepage
  const CMS_ENDPOINT = 'content/site-content.json';

  async function fetchContent() {
    try {
      const response = await fetch(CMS_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch content');
      return await response.json();
    } catch (error) {
      console.error('CMS fetch error:', error);
      return null;
    }
  }

  // ---- Renderers ----

  function renderHero(data) {
    const hero = document.getElementById('hero');
    const heading = document.getElementById('hero-heading');
    const subheading = document.getElementById('hero-subheading');
    const actions = document.getElementById('hero-actions');

    // Set background image from CMS content
    if (hero && data.backgroundImage) {
      hero.style.backgroundImage = `url('${data.backgroundImage}')`;
    }

    if (heading) {
      heading.innerHTML = data.headline.replace(
        'Industrial',
        '<span>Industrial</span>'
      );
    }
    if (subheading) subheading.textContent = data.subheadline;
    if (actions && data.cta) {
      actions.innerHTML = `
        <a href="${data.cta.href}" class="btn btn--primary btn--lg">${data.cta.text}</a>
        <a href="#services" class="btn btn--secondary btn--lg">Our Services</a>
      `;
    }
  }

  function renderAbout(data) {
    const heading = document.getElementById('about-heading');
    const text = document.getElementById('about-text');
    const highlights = document.getElementById('about-highlights');

    if (heading) heading.textContent = data.heading;
    if (text) {
      text.innerHTML = `<p>${data.intro}</p><p>${data.description}</p>`;
    }
    if (highlights && data.highlights) {
      highlights.innerHTML = data.highlights
        .map(
          (h) => `
        <div class="highlight">
          <div class="highlight__stat">${h.stat}</div>
          <div class="highlight__label">${h.label}</div>
        </div>
      `
        )
        .join('');
    }
  }

  function renderServices(data) {
    const heading = document.getElementById('services-heading');
    const subheading = document.getElementById('services-subheading');
    const grid = document.getElementById('services-grid');

    if (heading) heading.textContent = data.heading;
    if (subheading) subheading.textContent = data.intro;
    if (grid) {
      grid.innerHTML = data.items
        .map(
          (s) => `
        <div class="card">
          <div class="card__icon">${icons[s.icon] || ''}</div>
          <h3 class="card__title">${s.title}</h3>
          <p class="card__description">${s.description}</p>
        </div>
      `
        )
        .join('');
    }
  }

  function renderIndustries(data) {
    const heading = document.getElementById('industries-heading');
    const grid = document.getElementById('industries-grid');

    if (heading) heading.textContent = data.heading;
    if (grid) {
      grid.innerHTML = data.items
        .map((industry) => `<span class="industry-tag">${industry}</span>`)
        .join('');
    }
  }

  function renderTestimonials(data) {
    const heading = document.getElementById('testimonials-heading');
    const grid = document.getElementById('testimonials-grid');

    if (heading) heading.textContent = data.heading;
    if (grid) {
      grid.innerHTML = data.items
        .map(
          (t) => `
        <div class="testimonial">
          <div class="testimonial__quote-mark">&ldquo;</div>
          <p class="testimonial__text">${t.quote}</p>
          <div class="testimonial__author">
            <div class="testimonial__name">${t.author}</div>
            <div class="testimonial__company">${t.company}</div>
          </div>
        </div>
      `
        )
        .join('');
    }
  }

  function renderContact(data) {
    const heading = document.getElementById('contact-heading');
    const subheading = document.getElementById('contact-subheading');
    const info = document.getElementById('contact-info');

    if (heading) heading.textContent = data.heading;
    if (subheading) subheading.textContent = data.intro;
    if (info) {
      info.innerHTML = `
        <div class="contact-item">
          <div class="contact-item__icon">${icons.phone}</div>
          <div>
            <div class="contact-item__label">Phone</div>
            <div class="contact-item__value"><a href="tel:${data.phone.replace(/\s/g, '')}">${data.phone}</a></div>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-item__icon">${icons.mail}</div>
          <div>
            <div class="contact-item__label">Email</div>
            <div class="contact-item__value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-item__icon">${icons['map-pin']}</div>
          <div>
            <div class="contact-item__label">Address</div>
            <div class="contact-item__value">${data.address}</div>
          </div>
        </div>
      `;
    }
  }

  // ---- UI Interactions ----

  function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('mobile-overlay');
    const close = document.getElementById('mobile-close');
    const links = nav.querySelectorAll('.mobile-nav__link');

    function openNav() {
      nav.classList.add('active');
      overlay.classList.add('active');
      toggle.classList.add('active');
    }

    function closeNav() {
      nav.classList.remove('active');
      overlay.classList.remove('active');
      toggle.classList.remove('active');
    }

    toggle.addEventListener('click', openNav);
    close.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    links.forEach((link) => link.addEventListener('click', closeNav));
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn');
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = '#27ae60';
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.backgroundColor = '';
          form.reset();
        }, 3000);
      });
    }
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.card, .testimonial, .highlight, .contact-item').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ---- Init ----

  async function init() {
    // Set footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Fetch CMS content and render
    const content = await fetchContent();
    if (content) {
      renderHero(content.hero);
      renderAbout(content.about);
      renderServices(content.services);
      renderIndustries(content.industries);
      renderTestimonials(content.testimonials);
      renderContact(content.contact);

      // Update page title from CMS
      if (content.meta && content.meta.title) {
        document.title = content.meta.title;
      }
    }

    // Init UI
    initHeader();
    initMobileNav();
    initContactForm();

    // Delayed to ensure DOM is rendered
    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
