/* ============================================
   TASK 1: Three.js Animated Hero Background
   ============================================ */
function initHeroBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = 120;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color('#06b6d4');
  const colorPurple = new THREE.Color('#7c3aed');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const isCyan = Math.random() > 0.5;
    const color = isCyan ? colorCyan : colorPurple;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 5;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  if (!state.isMobile) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
    }
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    targetX += (mouseX * 0.5 - targetX) * 0.05;
    targetY += (mouseY * 0.5 - targetY) * 0.05;
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    particles.rotation.y += targetX * 0.01;
    particles.rotation.x += targetY * 0.01;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  });
}

/* ============================================
   Edrean Supremo — Enhanced Portfolio JavaScript
   ============================================ */

const state = {
  scrollProgress: 0,
  mouse: { x: 0, y: 0 },
  isLoaded: false,
  isMobile: window.innerWidth < 768
};

function initLoader() {
  const loader = document.getElementById('loader');
  const counter = document.getElementById('loader-counter');
  const progress = document.getElementById('loader-progress');
  if (!loader || !counter || !progress) return;

  let imagesLoaded = 0;
  const images = document.querySelectorAll('img');
  const totalImages = images.length;

  function updateLoader(pct) {
    counter.textContent = Math.min(Math.round(pct), 100);
    progress.style.width = Math.min(pct, 100) + '%';
  }

  function finishLoader() {
    updateLoader(100);
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
        state.isLoaded = true;
        document.body.classList.add('js-loaded');
        initHeroEntrance();
        initNavbar();
      }, 800);
    }, 400);
  }

  if (totalImages === 0) {
    setTimeout(finishLoader, 1500);
    return;
  }

  images.forEach(img => {
    if (img.complete) {
      imagesLoaded++;
      updateLoader((imagesLoaded / totalImages) * 100);
      if (imagesLoaded >= totalImages) finishLoader();
    } else {
      img.addEventListener('load', () => {
        imagesLoaded++;
        updateLoader((imagesLoaded / totalImages) * 100);
        if (imagesLoaded >= totalImages) finishLoader();
      });
      img.addEventListener('error', () => {
        imagesLoaded++;
        updateLoader((imagesLoaded / totalImages) * 100);
        if (imagesLoaded >= totalImages) finishLoader();
      });
    }
  });

  setTimeout(() => { if (!state.isLoaded) finishLoader(); }, 5000);
}

function initHeroEntrance() {
  const label = document.querySelector('.hero-label');
  const line1 = document.getElementById('hero-line1');
  const line2 = document.getElementById('hero-line2');
  const subtitle = document.querySelector('.hero-subtitle');
  const description = document.querySelector('.hero-description');
  const cta = document.querySelector('.hero-cta');
  const navbar = document.getElementById('navbar');

  // Fallback: make text visible immediately if GSAP isn't ready
  function safeAnimate(element, props) {
    if (window.gsap && element) {
      gsap.to(element, props);
    } else if (element) {
      element.style.opacity = props.opacity || '1';
      element.style.transform = 'translateY(0)';
    }
  }

  // Animate label
  safeAnimate(label, { opacity: 1, duration: 0.6, delay: 0.3 });

  // Animate availability badge (Task 5)
  const badge = document.querySelector('.availability-badge');
  safeAnimate(badge, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });

  // Animate headline letters with fallback
  if (line1) {
    if (window.gsap) {
      kineticTextReveal(line1, 0.5);
    } else {
      line1.style.opacity = '1';
    }
  }
  if (line2) {
    if (window.gsap) {
      kineticTextReveal(line2, 0.65);
    } else {
      line2.style.opacity = '1';
    }
  }

  // Animate subtitle
  safeAnimate(subtitle, { opacity: 1, y: 0, duration: 0.6, delay: 0.8 });

  // Animate description
  safeAnimate(description, { opacity: 1, y: 0, duration: 0.6, delay: 1.0 });

  // Animate CTA
  safeAnimate(cta, { opacity: 1, y: 0, duration: 0.6, delay: 1.2 });

  // Show navbar
  if (navbar) {
    navbar.classList.add('visible');
  }
}

function kineticTextReveal(element, delay = 0) {
  const text = element.textContent;
  element.innerHTML = '';
  const spans = [];
  for (let i = 0; i < text.length; i++) {
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    wrapper.style.verticalAlign = 'top';
    const inner = document.createElement('span');
    inner.textContent = text[i] === ' ' ? ' ' : text[i];
    inner.style.display = 'inline-block';
    inner.style.transform = 'translateY(120%)';
    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    spans.push(inner);
  }
  gsap.to(spans, { y: '0%', duration: 0.8, ease: 'power3.out', stagger: 0.04, delay: delay });
}

function setHeroInitialStates() {
  const label = document.querySelector('.hero-label');
  const badge = document.querySelector('.availability-badge');
  const subtitle = document.querySelector('.hero-subtitle');
  const description = document.querySelector('.hero-description');
  const cta = document.querySelector('.hero-cta');
  if (label) label.style.opacity = '0';
  if (badge) { badge.style.opacity = '0'; badge.style.transform = 'translateY(20px)'; }
  if (subtitle) { subtitle.style.opacity = '0'; subtitle.style.transform = 'translateY(20px)'; }
  if (description) { description.style.opacity = '0'; description.style.transform = 'translateY(20px)'; }
  if (cta) { cta.style.opacity = '0'; cta.style.transform = 'translateY(20px)'; }
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

function initPageCurtain() {
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.innerHTML = '<div class="page-curtain-layer"></div><div class="page-curtain-layer"></div><div class="page-curtain-layer"></div>';
  document.body.appendChild(curtain);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      // Skip external links (target="_blank") and modal links
      if (this.getAttribute('target') === '_blank') return;
      e.preventDefault();
      curtain.classList.add('active');
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { curtain.classList.remove('active'); }, 100);
      }, 400);
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('open')) mobileMenu.classList.remove('open');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('.back-to-top').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => { mobileMenu.classList.toggle('open'); });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { mobileMenu.classList.remove('open'); });
  });
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.add('visible');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => { link.classList.toggle('active', link.getAttribute('data-section') === id); });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scrolled');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('[data-scroll]').forEach(el => { observer.observe(el); });
}

function initOdometerStats() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target')) || 0;

    // Use GSAP if available, otherwise simple JS counter
    if (window.gsap && window.ScrollTrigger) {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = Math.round(obj.val);
            }
          });
        }
      });
    } else {
      // Simple count-up without GSAP
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        stat.textContent = current;
      }, 50);
    }
  });
}

function initSectionHeadlines() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const headlines = ['work-title', 'about-title', 'skills-title', 'projects-title', 'experience-title', 'contact-title'];
  headlines.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const originalText = el.textContent;
    el.innerHTML = '';
    el.style.opacity = '1';
    const chars = [];
    for (let i = 0; i < originalText.length; i++) {
      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.textContent = originalText[i] === ' ' ? ' ' : originalText[i];
      inner.style.display = 'inline-block';
      inner.style.transform = 'translateY(120%)';
      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      chars.push(inner);
    }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(chars, { y: '0%', duration: 0.8, ease: 'power3.out', stagger: 0.04 });
      }
    });
  });
}

function initManifestoAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const statementLines = document.querySelectorAll('.manifesto-statement p');
  const description = document.querySelector('.manifesto-description');
  statementLines.forEach((line, i) => {
    gsap.set(line, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: line,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(line, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.12 });
      }
    });
  });
  if (description) {
    gsap.set(description, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: description,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(description, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.5 });
      }
    });
  }
}

function initTimelineAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const nodes = document.querySelectorAll('.timeline-node');
  nodes.forEach((node, i) => {
    const dot = node.querySelector('.timeline-dot');
    const card = node.querySelector('.timeline-card');
    const isRight = card.classList.contains('right');
    if (dot) gsap.set(dot, { scale: 0 });
    if (card) gsap.set(card, { opacity: 0, x: isRight ? 30 : -30 });
    ScrollTrigger.create({
      trigger: node,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (dot) {
          gsap.to(dot, { scale: 1, duration: 0.4, ease: 'back.out(2)', onComplete: () => { dot.classList.add('pulsing'); } });
        }
        if (card) {
          gsap.to(card, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 });
        }
      }
    });
  });
}

function initSkillDots() {
  document.querySelectorAll('.skill-dots').forEach(container => {
    const level = parseInt(container.getAttribute('data-level')) || 0;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i < level ? ' filled' : '');
      container.appendChild(dot);
    }
  });
}

function initContactAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const contactElements = document.querySelectorAll('.contact-content > *');
  contactElements.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.1 });
      }
    });
  });
}

function initParallax() {
  const parallaxItems = document.querySelectorAll('.grid-item');
  if (!parallaxItems.length) return;
  window.addEventListener('scroll', () => {
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const speed = item.closest('.column-2') ? 0.08 : 0.05;
      const offset = (rect.top - window.innerHeight / 2) * speed;
      item.style.transform = 'translateY(' + offset + 'px)';
    });
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function initMouseSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero || state.isMobile) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mouse-x', x + '%');
    hero.style.setProperty('--mouse-y', y + '%');
  });
}

function initCardTilt() {
  if (state.isMobile) return;
  const cards = document.querySelectorAll('.work-card, .project-card, .skill-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

function initPortraitTilt() {
  if (state.isMobile) return;
  const portrait = document.querySelector('.hero-portrait');
  if (!portrait) return;
  portrait.addEventListener('mousemove', (e) => {
    const rect = portrait.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;
    portrait.style.transform = 'perspective(500px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.05)';
  });
  portrait.addEventListener('mouseleave', () => {
    portrait.style.transform = '';
  });
}

function initScrollIndicatorFade() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.backdropFilter = 'blur(20px)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
  }, { passive: true });
}

function initTextScramble() {
  const navLinks = document.querySelectorAll('.nav-link, .section-link');
  navLinks.forEach(link => {
    let scrambler = null;
    link.addEventListener('mouseenter', () => {
      if (scrambler) scrambler.destroy();
      scrambler = new ScrambleText(link);
      scrambler.scramble();
    });
    link.addEventListener('mouseleave', () => {
      if (scrambler) { scrambler.destroy(); scrambler = null; }
    });
  });
}

class ScrambleText {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.frame = 0;
    this.frameRequest = null;
  }
  scramble() {
    this.frame = 0;
    this.update();
  }
  update() {
    let output = '';
    for (let i = 0; i < this.originalText.length; i++) {
      if (i < this.frame / 2) {
        output += this.originalText[i];
      } else {
        output += this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }
    this.element.textContent = output;
    this.frame++;
    if (this.frame < this.originalText.length * 2 + 10) {
      this.frameRequest = requestAnimationFrame(() => this.update());
    } else {
      this.element.textContent = this.originalText;
    }
  }
  destroy() {
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    this.element.textContent = this.originalText;
  }
}

function initEasterEgg() {
  const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let index = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[index]) {
      index++;
      if (index === konami.length) { activateEasterEgg(); index = 0; }
    } else { index = 0; }
  });
}

function activateEasterEgg() {
  const titles = ['Embedded Systems Wizard', 'Code Sorcerer', 'FPGA Master', 'Full-Stack Ninja', 'IoT Architect', 'Digital Design Guru'];
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const original = subtitle.textContent;
    let i = 0;
    const interval = setInterval(() => {
      subtitle.textContent = titles[i % titles.length];
      i++;
      if (i > titles.length * 2) { clearInterval(interval); subtitle.textContent = original; }
    }, 200);
  }
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.boxShadow = 'inset 0 0 100px rgba(6, 182, 212, 0.2)';
    setTimeout(() => { hero.style.boxShadow = ''; }, 3000);
  }
}

function initTypingEffect() {
  const roles = ['Computer Engineering Student', 'Full-Stack Developer', 'Embedded Systems Developer', 'IoT Enthusiast', 'FPGA Developer'];
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  const staticText = subtitle.textContent;
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;
  function type() {
    const currentRole = roles[roleIndex];
    if (isPaused) { setTimeout(type, 1500); isPaused = false; return; }
    if (isDeleting) {
      charIndex--;
      subtitle.textContent = currentRole.substring(0, charIndex);
      if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    } else {
      charIndex++;
      subtitle.textContent = currentRole.substring(0, charIndex);
      if (charIndex === currentRole.length) { isDeleting = true; isPaused = true; }
    }
    const speed = isDeleting ? 50 : 100;
    setTimeout(type, speed);
  }
  setTimeout(() => { type(); }, 5000);
}

function initFloatingParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.4;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = state.isMobile ? 20 : 50;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1
    };
  }
  function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, ' + p.opacity + ')';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(6, 182, 212, ' + (0.1 * (1 - dist / 150)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  init();
  animate();
  window.addEventListener('resize', resize);
}

function initMagneticButtons() {
  if (state.isMobile) return;
  const buttons = document.querySelectorAll('.btn, .nav-cta');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initCardShine() {
  if (state.isMobile) return;
  const cards = document.querySelectorAll('.work-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--shine-x', x + '%');
      card.style.setProperty('--shine-y', y + '%');
      card.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)';
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
}

function initCustomCursor() {
  if (state.isMobile) return;
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = 'position:fixed;width:20px;height:20px;border:2px solid rgba(6,182,212,0.6);border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.1s ease,width 0.2s ease,height 0.2s ease,border-color 0.2s ease;transform:translate(-50%,-50%);mix-blend-mode:difference;';
  document.body.appendChild(cursor);
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorDot.style.cssText = 'position:fixed;width:4px;height:4px;background:rgba(6,182,212,0.8);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);';
  document.body.appendChild(cursorDot);
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
    // Spark trail effect (Task 3)
  let lastSparkTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkTime < 40) return;
    lastSparkTime = now;
    const spark = document.createElement('span');
    spark.className = 'cursor-spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    document.body.appendChild(spark);
    setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 500);
  });

  function animateCursor() {
    dotX += (cursorX - dotX) * 0.2;
    dotY += (cursorY - dotY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  const interactiveElements = document.querySelectorAll('a, button, .work-card, .project-card, .skill-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = 'rgba(6, 182, 212, 0.9)';
      cursor.style.background = 'rgba(6, 182, 212, 0.05)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.borderColor = 'rgba(6, 182, 212, 0.6)';
      cursor.style.background = 'transparent';
    });
  });
}

function initGradientBg() {
  const gradientBg = document.createElement('div');
  gradientBg.className = 'gradient-bg';
  gradientBg.style.cssText = 'position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at 20% 20%, rgba(6,182,212,0.03) 0%, transparent 50%),radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.03) 0%, transparent 50%),radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.02) 0%, transparent 60%);animation:gradientShift 20s ease-in-out infinite alternate;pointer-events:none;';
  const style = document.createElement('style');
  style.textContent = '@keyframes gradientShift { 0% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1) rotate(-2deg); } }';
  document.head.appendChild(style);
  document.body.insertBefore(gradientBg, document.body.firstChild);
}

function initGlowingOrbs() {
  const orbsContainer = document.createElement('div');
  orbsContainer.className = 'glowing-orbs';
  orbsContainer.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;';
  const colors = ['rgba(6, 182, 212, 0.15)', 'rgba(124, 58, 237, 0.12)', 'rgba(236, 72, 153, 0.1)'];
  colors.forEach((color, i) => {
    const orb = document.createElement('div');
    const size = 300 + i * 100;
    orb.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';filter:blur(100px);top:' + (20 + i * 25) + '%;left:' + (10 + i * 30) + '%;animation:orbFloat ' + (8 + i * 3) + 's ease-in-out infinite alternate;';
    orbsContainer.appendChild(orb);
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes orbFloat { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, -30px) scale(1.1); } }';
  document.head.appendChild(style);
  document.body.insertBefore(orbsContainer, document.body.firstChild);
}

// ============================================
// ENHANCEMENT #1: HORIZONTAL MARQUEE TICKER
// ============================================
function initMarqueeTicker() {
  const marquees = document.querySelectorAll('.marquee-section');
  marquees.forEach(marquee => {
    const track = marquee.querySelector('.marquee-track');
    if (!track) return;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      if (scrollVelocity > 30) {
        track.classList.add('scroll-fast');
        track.classList.remove('scroll-slow');
      } else if (scrollVelocity < 5) {
        track.classList.add('scroll-slow');
        track.classList.remove('scroll-fast');
      } else {
        track.classList.remove('scroll-fast', 'scroll-slow');
      }
      clearTimeout(track._speedTimeout);
      track._speedTimeout = setTimeout(() => {
        track.classList.remove('scroll-fast', 'scroll-slow');
      }, 300);
    }, { passive: true });
  });
}

// ============================================
// ENHANCEMENT #2: MAGNETIC PROJECT CARD PEEK
// ============================================
function initMagneticPeek() {
  if (state.isMobile) return;
  const peek = document.createElement('div');
  peek.className = 'peek-preview';
  peek.innerHTML = '<img src="" alt="">';
  document.body.appendChild(peek);
  const peekImg = peek.querySelector('img');
  let isPeeking = false;
  const workCards = document.querySelectorAll('.work-card[data-peek]');
  workCards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('mouseenter', () => {
      peekImg.src = img.src;
      peekImg.alt = img.alt;
      isPeeking = true;
      peek.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      isPeeking = false;
      peek.classList.remove('active');
    });
  });
  const gridItems = document.querySelectorAll('.grid-item[data-peek]');
  gridItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('mouseenter', () => {
      peekImg.src = img.src;
      peekImg.alt = img.alt;
      isPeeking = true;
      peek.classList.add('active');
    });
    item.addEventListener('mouseleave', () => {
      isPeeking = false;
      peek.classList.remove('active');
    });
  });
  document.addEventListener('mousemove', (e) => {
    if (!isPeeking) return;
    const offsetX = 20;
    const offsetY = -120;
    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;
    const peekRect = peek.getBoundingClientRect();
    if (x + peekRect.width > window.innerWidth - 20) x = e.clientX - peekRect.width - offsetX;
    if (y < 20) y = e.clientY + 20;
    peek.style.left = x + 'px';
    peek.style.top = y + 'px';
  });
}

// ============================================
// ENHANCEMENT #3: NOISE/GRAIN OVERLAY
// ============================================
function initNoiseOverlay() {
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  document.body.appendChild(noise);
}

// ============================================
// ENHANCEMENT #5: ANIMATED GRADIENT BORDER
// ============================================
function initSkillCardBorders() {
  if (!CSS.supports('(--angle: 0deg)')) {
    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        let angle = 0;
        card._borderAnim = setInterval(() => {
          angle = (angle + 2) % 360;
          card.style.setProperty('--angle', angle + 'deg');
        }, 16);
      });
      card.addEventListener('mouseleave', () => {
        if (card._borderAnim) { clearInterval(card._borderAnim); card._borderAnim = null; }
      });
    });
  }
}

// ============================================
// ENHANCEMENT #8: MAGNETIC EMAIL + PARTICLES
// ============================================
function initMagneticEmail() {
  const emailBtn = document.querySelector('.email-btn');
  if (!emailBtn) return;
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'btn-particles';
  emailBtn.appendChild(particlesContainer);
  const toast = document.createElement('div');
  toast.className = 'email-copied-toast';
  toast.textContent = 'Copied to clipboard!';
  document.body.appendChild(toast);
  if (!state.isMobile) {
    emailBtn.addEventListener('mousemove', (e) => {
      const rect = emailBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      emailBtn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
    emailBtn.addEventListener('mouseleave', () => { emailBtn.style.transform = ''; });
  }
  emailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'edrean.supremo@email.com';
    navigator.clipboard.writeText(email).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
    const rect = emailBtn.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const particleCount = 12;
    particlesContainer.innerHTML = '';
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.animationDelay = (i * 0.03) + 's';
      particlesContainer.appendChild(particle);
    }
    emailBtn.classList.add('bursting');
    setTimeout(() => {
      emailBtn.classList.remove('bursting');
      particlesContainer.innerHTML = '';
    }, 1000);
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
  });
}


/* ============================================
   TASK 2: Project Modal
   ============================================ */
function initProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  const closeBtn = document.getElementById('project-modal-close');
  const modalImg = document.getElementById('project-modal-img');
  const modalTitle = document.getElementById('project-modal-title');
  const modalDesc = document.getElementById('project-modal-desc');
  const modalTags = document.getElementById('project-modal-tags');
  const modalGithub = document.getElementById('project-modal-github');

  if (!overlay) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;

      const img = card.querySelector('.project-card-image img');
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const tags = card.querySelectorAll('.tag');
      const github = card.getAttribute('data-github') || 'https://github.com/edrean-supremo';

      if (modalImg) {
        modalImg.src = img ? img.src : '';
        modalImg.alt = img ? img.alt : '';
      }
      if (modalTitle) modalTitle.textContent = title ? title.textContent : '';
      if (modalDesc) modalDesc.textContent = desc ? desc.textContent : '';
      if (modalTags) {
        modalTags.innerHTML = '';
        tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = tag.textContent;
          modalTags.appendChild(span);
        });
      }
      if (modalGithub) {
        modalGithub.href = github;
        modalGithub.setAttribute('target', '_blank');
        modalGithub.setAttribute('rel', 'noopener noreferrer');
      }

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (!e.target.closest('a')) {
        e.stopPropagation();
      }
    });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================
   TASK 6: Project Filters
   ============================================ */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(',');
        const show = filter === 'all' || categories.includes(filter);
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.15';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  setHeroInitialStates();
  initLoader();
  initNoiseOverlay();
  initScrollProgress();
  initPageCurtain();
  initSmoothScroll();
  initMobileMenu();
  initScrollAnimations();
  initSkillDots();
  initParallax();
  initMouseSpotlight();
  initScrollIndicatorFade();
  initNavbarScroll();
  initTextScramble();
  initEasterEgg();
  initFloatingParticles();
  initGradientBg();
  initGlowingOrbs();
  initProjectFilters();

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    initOdometerStats();
    initSectionHeadlines();
    initManifestoAnimations();
    initTimelineAnimations();
    initContactAnimations();
  }

  window.addEventListener('load', () => {
    initHeroBackground();
    initCardTilt();
    initMagneticButtons();
    initCardShine();
    initCustomCursor();
    initTypingEffect();
    initMagneticPeek();
    initSkillCardBorders();
    initMagneticEmail();
    initProjectModal();
  });
});

window.addEventListener('resize', () => {
  state.isMobile = window.innerWidth < 768;
});