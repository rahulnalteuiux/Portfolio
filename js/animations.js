/**
 * animations.js — Scroll Reveal & Intersection Observer
 * Rahul Nalte Portfolio
 */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Counter Animation ---- */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease out expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    /* ---- Scroll Reveal ---- */
    function initReveal() {
        if (prefersReduced) {
            document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale').forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }

        const revealEls = document.querySelectorAll(
            '.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right, .reveal-scale'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || 0, 10);
                setTimeout(() => el.classList.add('revealed'), delay);
                observer.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    /* ---- Counter observer ---- */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    /* ---- Process steps stagger ---- */
    function initProcessSteps() {
        const steps = document.querySelectorAll('.process__step');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                steps.forEach((step, i) => {
                    setTimeout(() => step.classList.add('revealed'), i * 70);
                });
                observer.disconnect();
            });
        }, { threshold: 0.1 });

        const section = document.querySelector('.process__timeline');
        if (section) observer.observe(section);
    }

    /* ---- Active nav section highlight ---- */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.35, rootMargin: `-${72}px 0px 0px 0px` });

        sections.forEach(s => observer.observe(s));
    }

    /* ---- Ripple effect on buttons (Removed) ---- */
    function initRipple() {
        // Handled by CSS soft shadows instead
    }

    /* ---- 3D Tilt on Project Cards ---- */
    function initTilt() {
        if (prefersReduced) return;
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
                card.style.transition = 'none';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = '';
            });
        });
    }

    /* ---- Skill tabs ---- */
    function initSkillTabs() {
        const tabs = document.querySelectorAll('.skills__tab');
        const panels = document.querySelectorAll('.skills__panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach(t => { t.classList.remove('skills__tab--active'); t.setAttribute('aria-selected', 'false'); });
                panels.forEach(p => p.classList.add('skills__panel--hidden'));
                tab.classList.add('skills__tab--active');
                tab.setAttribute('aria-selected', 'true');
                const targetPanel = document.getElementById('tab-' + target);
                if (targetPanel) {
                    targetPanel.classList.remove('skills__panel--hidden');
                    // Reveal cards inside
                    targetPanel.querySelectorAll('.reveal-up, .skill-card, .tool-card').forEach((el, i) => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(16px)';
                        setTimeout(() => {
                            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            el.style.opacity = '1';
                            el.style.transform = '';
                        }, i * 40);
                    });
                }
            });
        });

        // Keyboard navigation for tabs
        tabs.forEach((tab, i) => {
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') { tabs[(i + 1) % tabs.length].click(); tabs[(i + 1) % tabs.length].focus(); }
                if (e.key === 'ArrowLeft') { tabs[(i - 1 + tabs.length) % tabs.length].click(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
            });
        });
    }

    /* ---- Init all ---- */
    document.addEventListener('DOMContentLoaded', () => {
        initReveal();
        initCounters();
        initProcessSteps();
        initActiveNav();
        initRipple();
        initTilt();
        initSkillTabs();
        initReadingProgress();
        initMagneticHover();
        initCurtainReveal();
        initHotspotTooltips();
    });

    /* ---- Reading Progress Bar ---- */
    function initReadingProgress() {
        const bar = document.createElement('div');
        bar.className = 'reading-progress';
        document.body.appendChild(bar);
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }, { passive: true });
    }

    /* ---- Magnetic Hover on [data-magnetic] (Removed) ---- */
    function initMagneticHover() {
        // Feature removed to prefer straightforward CSS-based hovers
    }

    /* ---- Image Curtain Reveal ---- */
    function initCurtainReveal() {
        const wraps = document.querySelectorAll('.img-curtain-wrap');
        if (!wraps.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || 0, 10);
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        wraps.forEach(el => observer.observe(el));
    }

    /* ---- Hotspot Tooltip Upgrade ---- */
    function initHotspotTooltips() {
        const tooltipData = [
            'Drag & Drop zone for intuitive file selection',
            'Live progress indicator with speed & ETA'
        ];
        document.querySelectorAll('.hotspot').forEach((hs, i) => {
            // Remove legacy h-note if exists
            const oldNote = hs.querySelector('.h-note');
            // Create accessible tooltip
            const tip = document.createElement('div');
            tip.className = 'hotspot__tooltip';
            tip.textContent = oldNote ? oldNote.textContent : (tooltipData[i] || 'UX annotation');
            if (oldNote) oldNote.remove();
            hs.appendChild(tip);
            hs.setAttribute('tabindex', '0');
            hs.setAttribute('role', 'button');
            hs.setAttribute('aria-label', 'UX Annotation ' + (i + 1));
        });
    }
})();

