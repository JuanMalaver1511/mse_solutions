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