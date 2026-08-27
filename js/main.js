/**
 * main.js — Core portfolio interactions
 * Rahul Nalte Portfolio
 */
(function () {
    'use strict';

    /* ============================================
       LOADER
    ============================================ */
    (function () {
        const loader = document.getElementById('loader');
        if (!loader) return;
        document.body.classList.add('loader-active');

        // Animate progress bar
        const progress = loader.querySelector('.loader__progress');
        let width = 0;
        const interval = setInterval(() => {
            width = Math.min(width + Math.random() * 14, 90);
            if (progress) progress.style.width = width + '%';
        }, 100);

        function hideLoader() {
            clearInterval(interval);
            if (progress) progress.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('loader--hidden');
                document.body.classList.remove('loader-active');
            }, 300);
        }

        if (document.readyState === 'complete') {
            setTimeout(hideLoader, 800);
        } else {
            window.addEventListener('load', () => setTimeout(hideLoader, 400));
        }
    })();

    /* ============================================
       MOBILE MENU
    ============================================ */
    (function () {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('mobileMenu');
        const links = document.querySelectorAll('.mobile-menu__link');
        if (!toggle || !menu) return;

        let isOpen = false;

        function openMenu() {
            isOpen = true;
            toggle.classList.add('open');
            menu.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            // Focus trap: focus first link
            links[0] && links[0].focus();
        }

        function closeMenu() {
            isOpen = false;
            toggle.classList.remove('open');
            menu.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) { closeMenu(); toggle.focus(); }
        });
    })();

    /* ============================================
       TESTIMONIALS CAROUSEL
    ============================================ */
    (function () {
        const track = document.getElementById('testimonialsTrack');
        const dotsContainer = document.getElementById('testimDots');
        const prevBtn = document.getElementById('testimPrev');
        const nextBtn = document.getElementById('testimNext');
        if (!track || !dotsContainer) return;

        const cards = Array.from(track.querySelectorAll('.testimonial-card'));
        if (!cards.length) return;

        let current = 0;
        let autoplayInterval = null;
        const AUTOPLAY_MS = 4500;

        // Build dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonials__dot' + (i === 0 ? ' testimonials__dot--active' : '');
            dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function getDots() {
            return Array.from(dotsContainer.querySelectorAll('.testimonials__dot'));
        }

        function show(index, direction) {
            const dots = getDots();
            cards[current].classList.remove('active');
            dots[current].classList.remove('testimonials__dot--active');
            dots[current].setAttribute('aria-selected', 'false');

            current = (index + cards.length) % cards.length;

            cards[current].classList.add('active');
            dots[current].classList.add('testimonials__dot--active');
            dots[current].setAttribute('aria-selected', 'true');
        }

        function goTo(index) {
            show(index);
        }

        function next() {
            show(current + 1);
        }

        function prev() {
            show(current - 1);
        }

        function startAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(next, AUTOPLAY_MS);
        }

        // Keyboard navigation
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); });

        // Touch/swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        }, { passive: true });

        // Init first card
        cards[0].classList.add('active');

        // Start autoplay — never pauses
        startAutoplay();
    })();

    /* ============================================
       CONTACT FORM
    ============================================ */
    (function () {
        const form = document.getElementById('contactForm');
        const btn = document.getElementById('submitBtn');
        const success = document.getElementById('formSuccess');
        if (!form) return;

        const fields = {
            name: { el: form.querySelector('#name'), err: form.querySelector('#nameError'), msg: 'Please enter your name.' },
            email: { el: form.querySelector('#email'), err: form.querySelector('#emailError'), msg: 'Please enter a valid email address.' },
            message: { el: form.querySelector('#message'), err: form.querySelector('#messageError'), msg: 'Please write a message.' },
        };

        function validate() {
            let valid = true;
            const { name, email, message } = fields;

            // Name
            if (!name.el.value.trim()) {
                showError(name.el, name.err, name.msg); valid = false;
            } else { clearError(name.el, name.err); }

            // Email
            const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRx.test(email.el.value.trim())) {
                showError(email.el, email.err, email.msg); valid = false;
            } else { clearError(email.el, email.err); }

            // Message
            if (message.el.value.trim().length < 10) {
                showError(message.el, message.err, message.msg); valid = false;
            } else { clearError(message.el, message.err); }

            return valid;
        }

        function showError(input, errEl, msg) {
            input.classList.add('error');
            if (errEl) errEl.textContent = msg;
        }
        function clearError(input, errEl) {
            input.classList.remove('error');
            if (errEl) errEl.textContent = '';
        }

        // Live validation
        Object.values(fields).forEach(({ el }) => {
            el && el.addEventListener('input', validate);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate()) return;

            // Show loading state
            btn.classList.add('btn--loading');
            btn.disabled = true;

            // Simulate send (replace with EmailJS in production)
            setTimeout(() => {
                btn.classList.remove('btn--loading');
                btn.disabled = false;
                if (success) {
                    success.classList.add('show');
                    form.reset();
                    setTimeout(() => success.classList.remove('show'), 6000);
                }
            }, 1800);
        });
    })();

    /* ============================================
       TYPING ANIMATION (Hero headline)
    ============================================ */
    (function () {
        // The headline already shows via CSS animation; this adds a subtle
        // typewriter cursor to the gradient span.
        const span = document.querySelector('.hero__headline-gradient');
        if (!span || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // Simple fade-in handled by CSS, no JS typewriter needed to keep it clean.
    })();

    /* ============================================
       READ MORE / READ LESS (Mobile & Small Screens)
    ============================================ */
    window.toggleReadMore = function (btn) {
        if (!btn) return;

        const container = btn.closest('.mobile-read-more') || btn.closest('.learning-card') || btn.parentElement;
        if (!container) return;

        const content = container.querySelector('.read-more-content') ||
                        container.querySelector('.learning-description') ||
                        container.nextElementSibling;

        const isCurrentlyExpanded = container.classList.contains('expanded') ||
                                    container.classList.contains('is-expanded') ||
                                    (content && (content.classList.contains('is-visible') || content.classList.contains('expanded') || content.style.display === 'block'));

        if (isCurrentlyExpanded) {
            container.classList.remove('expanded', 'is-expanded');
            if (content) {
                content.classList.remove('is-visible', 'expanded', 'is-expanded');
                content.style.display = 'none';
            }
            btn.setAttribute('aria-expanded', 'false');
            btn.classList.remove('expanded', 'is-expanded');

            const defaultMore = btn.getAttribute('data-more-text') || (btn.classList.contains('learning-read-more') ? 'Read more' : 'Read More');
            btn.textContent = defaultMore;
        } else {
            container.classList.add('expanded');
            if (content) {
                content.classList.add('is-visible', 'expanded');
                content.style.display = 'block';
            }
            btn.setAttribute('aria-expanded', 'true');
            btn.classList.add('expanded');

            const defaultLess = btn.getAttribute('data-less-text') || (btn.classList.contains('learning-read-more') ? 'Read less' : 'Read Less');
            btn.textContent = defaultLess;
        }
    };

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.read-more-btn, .learning-read-more');
        if (btn) {
            e.preventDefault();
            window.toggleReadMore(btn);
        }
    });

})();
