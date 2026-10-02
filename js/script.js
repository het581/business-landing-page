(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');
  const faqItems = document.querySelectorAll('.faq-item');
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-counter]');
  const year = document.getElementById('year');
  const processGrid = document.querySelector('.process-grid');
  const analyticsPanel = document.querySelector('.analytics-panel');
  const chartDemo = document.querySelector('.chart-demo');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 15);
  };

  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
  };

  updateHeader();
  updateScrollProgress();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('open');
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherButton = other.querySelector('button');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      });
      if (shouldOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const formatCounter = (value, target) => {
    if (target >= 1000) return `${Math.round(value).toLocaleString()}+`;
    if (target < 10) return value.toFixed(1);
    return `${Math.round(value)}%`;
  };

  const animateCounter = (element) => {
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';
    const target = Number(element.dataset.counter);
    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCounter(target * eased, target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          if (entry.target.matches('[data-counter]')) animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12 })
    : null;

  if (observer) {
    revealItems.forEach((item) => observer.observe(item));
    counters.forEach((counter) => observer.observe(counter));

    const sectionObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    [processGrid, analyticsPanel, chartDemo].forEach((element) => {
      if (element) sectionObserver.observe(element);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
    counters.forEach(animateCounter);
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();


  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formStatus.classList.remove('error');
      const honeypot = document.getElementById('website');
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const data = new FormData(contactForm);
      const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
      const name = clean(data.get('name'), 80);
      const email = clean(data.get('email'), 254);
      const message = clean(data.get('message'), 2000);
      const team = clean(data.get('team'), 60);
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (honeypot && honeypot.value.trim() !== '') {
        formStatus.textContent = 'Unable to submit this request.';
        return;
      }
      const now = Date.now();
      const lastSubmit = Number(contactForm.dataset.lastSubmit || 0);
      if (now - lastSubmit < 5000) {
        formStatus.textContent = 'Please wait a few seconds before submitting again.';
        return;
      }
      if (name.length < 2 || !validEmail || message.length < 10 || !team) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please complete all fields with a valid email address.';
        return;
      }

      contactForm.dataset.lastSubmit = String(now);
      if (submitButton) submitButton.disabled = true;
      const subject = encodeURIComponent(`NEXORA project brief — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nTeam size: ${team}\n\nWhat should we automate?\n${message}`
      );
      formStatus.textContent = 'Preparing your email client…';
      window.location.href = `mailto:hello@nexora.example?subject=${subject}&body=${body}`;
      window.setTimeout(() => {
        formStatus.textContent = 'Your project brief is ready in your email client.';
        if (submitButton) submitButton.disabled = false;
      }, 700);
    });
  }
