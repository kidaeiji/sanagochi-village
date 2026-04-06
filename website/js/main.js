// ===================================
// 佐那河内村 ウェブサイト JS
// ===================================

// ナビゲーション スクロール制御
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// スクロールアニメーション（Intersection Observer）
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // カードなどの連続要素は少し遅延させる
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-up').forEach((el, i) => {
  el.dataset.delay = (i % 6) * 80;
  observer.observe(el);
});

// 数字カウントアップアニメーション
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = target * eased;

    if (Number.isInteger(target)) {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    } else {
      el.textContent = current.toFixed(1) + suffix;
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        animateCounter(num);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats-inner');
if (statsEl) statsObserver.observe(statsEl);

// スムーズスクロール（アンカーリンク）
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 64; // ナビの高さ
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ハンバーガーメニュー（モバイル）
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    if (isOpen) {
      navLinks.style.display = '';
      navLinks.style.flexDirection = '';
      hamburger.classList.remove('open');
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'fixed';
      navLinks.style.top = '64px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(255,255,255,0.97)';
      navLinks.style.padding = '1.5rem 2rem';
      navLinks.style.gap = '1.5rem';
      navLinks.style.boxShadow = '0 8px 30px rgba(27,67,50,0.1)';
      hamburger.classList.add('open');
    }
  });

  // メニュー内リンクをクリックしたら閉じる
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.style.display = '';
      hamburger.classList.remove('open');
    });
  });
}
