/* ═══════════════════════════════════════════════
   KING SOLOMON ENTERTAINMENT MEDIA
   Static Site JavaScript — Based on original theme
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  const isHome = document.body.classList.contains('home');
  const header = document.getElementById('site-header');
  const annBar = document.querySelector('.ann-bar');
  const ANN_H  = annBar ? annBar.offsetHeight : 38;

  /* ── ANNOUNCEMENT BAR ── */
  const msgs = document.querySelectorAll('.ann-msg');
  const annP = document.getElementById('annP');
  const annN = document.getElementById('annN');
  let cur = 0;
  function showMsg(i) { msgs.forEach(m => m.classList.remove('on')); msgs[i].classList.add('on'); }
  annN?.addEventListener('click', () => { cur = (cur+1) % msgs.length; showMsg(cur); });
  annP?.addEventListener('click', () => { cur = (cur-1+msgs.length) % msgs.length; showMsg(cur); });
  if (msgs.length) setInterval(() => { cur = (cur+1) % msgs.length; showMsg(cur); }, 4500);

  /* ── HEADER SCROLL ── */
  let prev = 0;
  function onScroll() {
    const s = window.scrollY;
    if (!isHome) {
      header.classList.add('scrolled');
      header.style.top = '0';
    } else {
      header.classList.toggle('scrolled', s > 60);
      if (s > 10) {
        annBar.style.transform = 'translateY(-100%)';
        header.style.top = '0';
      } else {
        annBar.style.transform = 'translateY(0)';
        header.style.top = ANN_H + 'px';
      }
    }
    prev = s;
  }
  if (annBar) annBar.style.transition = 'transform 0.35s ease';
  if (header) header.style.transition = 'background var(--transition), backdrop-filter var(--transition), top 0.35s ease';
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE NAV ── */
  const hamBtn  = document.querySelector('.ham-btn');
  const mobNav  = document.querySelector('.mob-nav');
  const mobClose = document.querySelector('.mob-close');
  hamBtn?.addEventListener('click', () => { mobNav.classList.add('open'); document.body.style.overflow = 'hidden'; });
  const closeNav = () => { mobNav?.classList.remove('open'); document.body.style.overflow = ''; };
  mobClose?.addEventListener('click', closeNav);
  mobNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ── ACTIVE NAV ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mob-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── NETWORKS TICKER DUPLICATE ── */
  const track = document.querySelector('.logos-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── GALLERY FILTER ── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || (item.dataset.type || '').includes(filter);
        item.style.opacity = match ? '1' : '0.2';
        item.style.pointerEvents = match ? '' : 'none';
      });
    });
  });

  /* ── LIGHTBOX ── */
  const lightbox        = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lbPrev          = document.getElementById('lbPrev');
  const lbNext          = document.getElementById('lbNext');
  const galArr          = Array.from(galleryItems);
  let lbIdx = 0;

  function openLb(i) {
    if (!lightbox) return;
    lbIdx = i;
    lightboxContent.innerHTML = '';
    const item = galArr[i];
    const src  = item.dataset.src;
    const img  = document.createElement('img');
    img.src = src; img.alt = item.querySelector('img')?.alt || '';
    lightboxContent.appendChild(img);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox?.classList.remove('open');
    if (lightboxContent) lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  galArr.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  lightboxClose?.addEventListener('click', closeLb);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  lbPrev?.addEventListener('click', () => openLb((lbIdx - 1 + galArr.length) % galArr.length));
  lbNext?.addEventListener('click', () => openLb((lbIdx + 1) % galArr.length));
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb((lbIdx - 1 + galArr.length) % galArr.length);
    if (e.key === 'ArrowRight') openLb((lbIdx + 1) % galArr.length);
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('solomonContactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      const btn = form.querySelector('[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;
      setTimeout(() => {
        msg.style.display = 'block';
        msg.style.color = 'var(--gold)';
        msg.innerHTML = '&#10003; Message sent — we\'ll be in touch shortly.';
        form.reset();
        btn.innerHTML = origText;
        btn.disabled = false;
        setTimeout(() => { msg.style.display = 'none'; }, 7000);
      }, 900);
    });
  }

});
