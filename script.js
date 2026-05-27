(() => {
    'use strict';

    /* ============================================================
       THEME TOGGLE — persisted to localStorage
       ============================================================ */
    const THEME_KEY = 'tsion-theme';
    const root = document.documentElement;

    const getStoredTheme = () => {
        try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
    };

    const setStoredTheme = (theme) => {
        try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* noop */ }
    };

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
    };

    // Init: stored > system preference > dark default
    const initialTheme = getStoredTheme()
        || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(initialTheme);

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            setStoredTheme(next);
        });
    }

    /* ============================================================
       MOBILE NAV
       ============================================================ */
    const burger = document.querySelector('.burger');
    const navRight = document.querySelector('.topbar-right');
    if (burger && navRight) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('on');
            navRight.classList.toggle('show');
        });
    }

    /* ============================================================
       SCROLL REVEAL — IntersectionObserver
       ============================================================ */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }

    /* ============================================================
       STAT COUNTERS — count up when section enters
       ============================================================ */
    const counters = document.querySelectorAll('.stat-num');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();
        // easing: easeOutCubic
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(ease(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach((c) => counterObserver.observe(c));
    } else {
        counters.forEach((c) => {
            c.textContent = (c.dataset.target || '0') + (c.dataset.suffix || '');
        });
    }

    /* ============================================================
       SERVICES — accordion
       ============================================================ */
    const services = document.querySelectorAll('.service');
    services.forEach((service) => {
        const head = service.querySelector('.service-head');
        if (!head) return;
        head.addEventListener('click', () => {
            const isOpen = service.getAttribute('data-open') === 'true';
            // close others (single-open accordion)
            services.forEach((s) => s.setAttribute('data-open', 'false'));
            service.setAttribute('data-open', isOpen ? 'false' : 'true');
        });
    });

    /* ============================================================
       SMOOTH NAV ACTIVE STATE — highlight current section
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.topbar-link');
    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        const matches = link.getAttribute('href') === `#${id}`;
                        link.style.color = matches ? 'var(--ink)' : '';
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach((sec) => navObserver.observe(sec));
    }
})();
