/**
 * scroll.js — Smooth scroll, parallax, back-to-top
 * Rahul Nalte Portfolio
 */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const subnav = document.querySelector('.cs-subnav');
            const offset = subnav ? 120 : 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    });

    /* ---- Case Study Sub-Navigation Active Section Observer ---- */
    (function () {
        const subnavLinks = document.querySelectorAll('.cs-subnav__link');
        if (!subnavLinks.length) return;

        const sections = [];
        subnavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sec = document.querySelector(href);
                if (sec) sections.push(sec);
            }
        });

        if (!sections.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    subnavLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('is-active', isActive);
                        if (isActive) {
                            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    })();

    /* ---- Sticky Navbar (hide on scroll down, show on scroll up) ---- */
    (function () {
        const nav = document.getElementById('navbar');
        if (!nav) return;
        let lastY = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    nav.classList.toggle('nav--scrolled', y > 20);
                    // Hide on scroll down past hero (> 80px), show on scroll up
                    if (y > 500) {
                        nav.classList.toggle('nav--hidden', y > lastY + 2);
                    } else {
                        nav.classList.remove('nav--hidden');
                    }
                    lastY = y;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    })();

    /* ---- Back to top ---- */
    (function () {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    })();

    /* ---- Parallax on hero blobs ---- */
    (function () {
        if (prefersReduced) return;
        const blobs = document.querySelectorAll('.hero__blob');
        if (!blobs.length) return;

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            blobs.forEach((blob, i) => {
                const speed = [0.15, 0.1, 0.2][i] || 0.1;
                blob.style.transform = `translateY(${y * speed}px)`;
            });
        }, { passive: true });
    })();

    /* ---- Parallax on hero headline ---- */
    (function () {
        if (prefersReduced) return;
        const hero = document.querySelector('.hero__content');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                hero.style.transform = `translateY(${y * 0.08}px)`;
                hero.style.opacity = 1 - (y / (window.innerHeight * 0.75));
            }
        }, { passive: true });
    })();

    /* ---- Progress bar on scroll (thin line at top) ---- */
    (function () {
        const bar = document.createElement('div');
        bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 2px;
      background: linear-gradient(90deg, #2563EB, #60A5FA);
      z-index: 10000; width: 0%; transition: width 0.1s linear;
      pointer-events: none;
    `;
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
        }, { passive: true });
    })();
})();
