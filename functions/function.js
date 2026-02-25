// Función para animar los contadores
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start) + '+';
                }
            }, 16);
        }

        // Intersection Observer para iniciar la animación cuando la sección sea visible
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = document.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar la sección de estadísticas
        const statsSection = document.querySelector('.stats-section');
        observer.observe(statsSection);

// funcion del carrusel de clientes
(function () {
  const track    = document.getElementById('track');
  const btnPrev  = document.getElementById('prev');
  const btnNext  = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');
  const cards    = Array.from(track.children);

  let currentIndex = 0;
  let visibleCount = getVisible();
  let totalPages   = Math.ceil(cards.length / visibleCount);
  let autoPlayTimer = null;

  /* ── Calcula cuántas tarjetas caben ── */
  function getVisible() {
    const w = window.innerWidth;
    if (w <= 380) return 1;
    if (w <= 600) return 2;
    if (w <= 900) return 3;
    return 5;
  }

  /* ── Crea los puntos ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Página ${i + 1}`);
      d.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
      dotsWrap.appendChild(d);
    }
  }

  /* ── Actualiza puntos activos ── */
  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  /* ── Mueve el carrusel ── */
  function goTo(page) {
    // Wrap circular: si pasa del último vuelve al primero y viceversa
    if (page >= totalPages) page = 0;
    if (page < 0) page = totalPages - 1;
    currentIndex = page;

    // Calcula el offset usando el índice de la PRIMERA tarjeta visible de esa página
    const firstCardIndex = currentIndex * visibleCount;
    const cardEl = cards[firstCardIndex] || cards[0];
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    const offset = firstCardIndex * (cardEl.offsetWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  /* ── Botones ── */
  btnPrev.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoPlay(); });
  btnNext.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoPlay(); });

  /* ── Swipe táctil ── */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      resetAutoPlay();
    }
  });

  /* ── Re-calcula al redimensionar ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visibleCount = getVisible();
      totalPages   = Math.ceil(cards.length / visibleCount);
      currentIndex = 0;
      buildDots();
      goTo(0);
    }, 150);
  });

  /* ── Auto-play ── */
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goTo(currentIndex + 1), 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  /* ── Pausa al hover ── */
  track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  track.addEventListener('mouseleave', () => startAutoPlay());

  /* ── Inicializar ── */
  buildDots();
  goTo(0);
  startAutoPlay();
})();