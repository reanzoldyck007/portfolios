const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

$('#year').textContent = new Date().getFullYear();

// Nav: border on scroll + mobile toggle
const nav = $('#nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
const toggle = $('#nav-toggle'), links = $('#nav-links');
toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', links.classList.toggle('open')));
$$('a', links).forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Highlight the nav link of the section in view
const navMap = new Map($$('a[href^="#"]:not(.btn)', links).map(a => [a.getAttribute('href').slice(1), a]));
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  navMap.get(e.target.id)?.classList.toggle('active', e.isIntersecting);
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

// Project filters
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', b === btn); });
  const f = btn.dataset.filter;
  $$('.project').forEach(c => { c.hidden = f !== 'all' && !c.dataset.category.split(',').includes(f); });
}));

// Copy email to clipboard
const copyBtn = $('#copy-email');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = 'Copied';
  } catch { copyBtn.textContent = 'Copy failed'; }
  $('#copy-status').textContent = copyBtn.textContent;
  setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
});

// Modals: close on button or backdrop click
$$('.modal').forEach(m => m.addEventListener('click', e => {
  if (e.target === m || e.target.closest('.modal-close')) m.close();
}));

// Keyboard access for clickable cards
$$('.card').forEach(c => {
  c.tabIndex = 0;
  c.setAttribute('role', 'button');
  c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
});

// Project modal
const pm = $('#project-modal');
$$('.project').forEach(card => card.addEventListener('click', () => {
  const img = $('img', card);
  $('#pm-img').src = img.src;
  $('#pm-img').alt = img.alt;
  $('#pm-title').textContent = $('h3', card).textContent;
  $('#pm-desc').textContent = $('p', card).textContent;
  $('#pm-meta').textContent = $('.meta', card).textContent;
  const link = card.dataset.link;
  $('#pm-link').href = link;
  $('#pm-link').textContent = link.includes('github.com') ? 'View on GitHub' : 'Visit site';
  pm.showModal();
}));

// Video modal: plays the card's GitHub-hosted video, stops on close
const vm = $('#video-modal'), video = $('#vm-video');
$$('.video-card').forEach(card => card.addEventListener('click', () => {
  video.src = card.dataset.video;
  $('#vm-title').textContent = $('h3', card).textContent;
  vm.showModal();
  video.play().catch(() => {}); // autoplay may be blocked; controls are visible
}));
vm.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); });
