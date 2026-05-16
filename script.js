/* ============================================================
   REYNALD D. NOGALIZA — PORTFOLIO SCRIPT
   Animations, Interactions, Effects
   ============================================================ */

'use strict';

/* ─── LOADING SCREEN ────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger hero animations after load
    document.querySelectorAll('#hero .reveal-up, #hero .reveal-right, #hero .reveal-left')
      .forEach(el => el.classList.add('visible'));
  }, 2200);
});

/* ─── SCROLL PROGRESS BAR ───────────────────────────────────── */
function updateScrollBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  const bar = document.getElementById('scroll-bar');
  if (bar) bar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollBar, { passive: true });

/* ─── NAVBAR ─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ─── ACTIVE NAV LINKS ON SCROLL ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ─── TYPING EFFECT ─────────────────────────────────────────── */
const phrases = [
  'IT Intern',
  'Front-End Developer',
  'Technical Support Enthusiast',
  'Problem Solver',
  'Lifelong Learner'
];
let pIndex = 0, cIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[pIndex];

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, cIndex + 1);
    cIndex++;
    if (cIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, cIndex - 1);
    cIndex--;
    if (cIndex === 0) {
      isDeleting = false;
      pIndex = (pIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 50 : 90);
}
setTimeout(typeLoop, 2600);

/* ─── PARTICLE CANVAS ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 70;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      if (this.y < -10) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── INTERSECTION OBSERVER — SCROLL REVEALS ────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Don't observe hero (handled by loader)
  if (!el.closest('#hero')) revealObserver.observe(el);
});

/* ─── ANIMATED COUNTERS ─────────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ─── SKILL BAR ANIMATIONS ──────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => {
  skillObserver.observe(cat);
});

/* ─── CONTACT FORM ──────────────────────────────────────────── */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-send');
    const btnText = btn.querySelector('.btn-text');
    const original = btnText.textContent;

    btnText.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send (replace with real email service like EmailJS or Formspree)
    setTimeout(() => {
      btn.disabled = false;
      btnText.textContent = original;
      form.reset();
      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }, 1800);
  });
}

/* ─── SMOOTH SCROLL (fallback for older browsers) ───────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── CARD TILT EFFECT ──────────────────────────────────────── */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -intensity;
      const rotY = ((x - cx) / cx) * intensity;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
addTilt('.stat-card', 5);
addTilt('.project-card', 4);
addTilt('.skill-category', 3);

/* ─── CURSOR GLOW EFFECT (desktop only) ────────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  (function animCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animCursor);
  })();
}

/* ─── STAGGERED REVEAL FOR LISTS ────────────────────────────── */
const listObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('li').forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, 50 + i * 80);
      });
      listObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.exp-list').forEach(list => listObserver.observe(list));

/* ─── SECTION LABEL ANIMATION ───────────────────────────────── */
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'none';
      entry.target.offsetHeight; // reflow
      entry.target.style.animation = '';
    }
  });
}, { threshold: 0.8 });
document.querySelectorAll('.section-label').forEach(l => labelObserver.observe(l));

console.log('%c Reynald D. Nogaliza | Portfolio ', 'background: #38bdf8; color: #0f172a; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;');
console.log('%c Built with HTML, CSS & JavaScript ', 'color: #94a3b8; font-size: 11px;');

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.log('SW error:', err));
  });
}
