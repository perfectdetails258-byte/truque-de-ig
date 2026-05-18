/* ══════════════════════════════════════════
   TRUQUE DO GI – script.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Countdown Timer ── */
  const minEl = document.getElementById('countdown-min');
  const secEl = document.getElementById('countdown-sec');
  if (minEl && secEl) {
    let timeLeft = 15 * 60; // 15 minutos em segundos
    const timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timer);
        timeLeft = 0;
      }
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      minEl.textContent = m.toString().padStart(2, '0');
      secEl.textContent = s.toString().padStart(2, '0');
    }, 1000);
  }

  /* ── 1. Intersection Observer: animar cards ao entrar na viewport ── */
  const observeTargets = document.querySelectorAll('.fb-card, .video-wrapper, .cta-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  observeTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    observer.observe(el);
  });

  /* ── 2. Smooth scroll para links internos ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 3. Contador animado nas reações (efeito de pulso ao clicar) ── */
  document.querySelectorAll('.reaction').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function () {
      const numEl = this.querySelector('span');
      if (!numEl) return;

      const current = parseInt(numEl.textContent.replace(/\D/g, ''), 10);
      numEl.textContent = (current + 1).toString();

      // Pulso visual
      this.style.transform = 'scale(1.35)';
      this.style.transition = 'transform .15s ease';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  /* ── 4. Header hero: parallax suave no scroll ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrollY * 0.3}px`;
      }
    }, { passive: true });
  }

  /* ── 5. Adicionar classe 'visible' a elementos já observados ── */
  document.addEventListener('scroll', () => {}, { passive: true });

});

/* ── Helper: marcar visible quando IntersectionObserver dispara ── */
document.addEventListener('animationend', (e) => {
  e.target.style.opacity = '';
  e.target.style.transform = '';
});

// Polyfill simples para visible
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
