document.addEventListener('DOMContentLoaded', () => {
  // Wrap in DOMContentLoaded
  var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
  var themeToggleBtn = document.getElementById('theme-toggle');

  // Your logo button redirect (if this is desired behavior)
  const logoButton1 = document.querySelector('.button1');
  if (logoButton1) {
    logoButton1.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }
  const logoButton2 = document.querySelector('.button2');
  if (logoButton2) {
    logoButton2.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  // Initial icon state based on theme

  if (themeToggleDarkIcon && themeToggleLightIcon) {
    if (document.documentElement.classList.contains('dark')) {
      themeToggleLightIcon.classList.remove('hidden');
      themeToggleDarkIcon.classList.add('hidden');
    } else {
      themeToggleDarkIcon.classList.remove('hidden');
      themeToggleLightIcon.classList.add('hidden');
    }
  } else {
    console.error('Theme toggle icons not found!');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      // toggle icons inside button
      if (themeToggleDarkIcon && themeToggleLightIcon) {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
      }

      // if set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        }
      } else {
        // if NOT set via local storage previously
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });
  } else {
    console.error('Theme toggle button not found!');
  }

  // Typed.js initialization
  const typedElement = document.getElementById('typed');
  const typedStringsElement = document.getElementById('typed-strings');
  if (typedElement && typedStringsElement) {
    try {
      var typed = new Typed('#typed', {
        stringsElement: '#typed-strings',
        backSpeed: 40,
        typeSpeed: 60,
        loop: true, // Optional: if you want it to loop
      });
    } catch (e) {
      console.error('Typed.js initialization failed:', e);
    }
  }
});

// Lightbox
(function () {
  function init() {
    const thumbs = Array.from(document.querySelectorAll('[data-lightbox]'));
    if (!thumbs.length) return;

    // Overlay aanmaken
    const box = document.createElement('div');
    box.id = 'lightbox';
    box.className = 'lb hidden';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML = `
      <div class="lb-scroll"><img class="lb-img" src="" alt="" /></div>
      <p class="lb-caption"></p>
      <button type="button" class="lb-btn lb-close" aria-label="Close">&times;</button>
      <button type="button" class="lb-btn lb-prev" aria-label="Previous image">&#8249;</button>
      <button type="button" class="lb-btn lb-next" aria-label="Next image">&#8250;</button>
    `;
    document.body.appendChild(box);

    const scroller = box.querySelector('.lb-scroll');
    const img = box.querySelector('.lb-img');
    const caption = box.querySelector('.lb-caption');
    const prev = box.querySelector('.lb-prev');
    const next = box.querySelector('.lb-next');
    let index = 0;
    let lastFocus = null;

    // Pijltjes verbergen als er maar 1 afbeelding is
    if (thumbs.length < 2) {
      prev.style.display = 'none';
      next.style.display = 'none';
    }

    function setZoom(on) {
      img.classList.toggle('is-zoomed', on);
      if (!on) scroller.scrollTo(0, 0);
    }

    function show(i) {
      index = (i + thumbs.length) % thumbs.length;
      const src = thumbs[index].querySelector('img');
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      const cap = thumbs[index].closest('figure')?.querySelector('figcaption');
      caption.textContent = cap ? cap.textContent : '';
      setZoom(false);
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lb-close').focus();
    }

    function close() {
      box.classList.add('hidden');
      document.body.style.overflow = '';
      setZoom(false);
      if (lastFocus) lastFocus.focus();
    }

    thumbs.forEach((t, i) => t.addEventListener('click', () => open(i)));
    img.addEventListener('click', () =>
      setZoom(!img.classList.contains('is-zoomed'))
    );
    box.querySelector('.lb-close').addEventListener('click', close);
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    scroller.addEventListener('click', e => {
      if (e.target === scroller) close();
    });

    document.addEventListener('keydown', e => {
      if (box.classList.contains('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft' && thumbs.length > 1) show(index - 1);
      if (e.key === 'ArrowRight' && thumbs.length > 1) show(index + 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
