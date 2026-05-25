/**
 * 2026 GLOBAL EXPERIENCE SYSTEM: Rahul Nalte Portfolio
 * Focus: Experience Continuity, Transitions, and Personal Story Systems
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * 1. PAGE TRANSITION TRIGGER
     */
    document.body.classList.add('page-transition-in');

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.endsWith('.html') || href.startsWith('/') || href.startsWith('./'))) {
            link.addEventListener('click', (e) => {
                if (href.startsWith('#')) return;
                e.preventDefault();
                document.body.classList.add('page-transition-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });

    /**
     * 2. SCROLL REVEAL SYSTEM (Editorial)
     */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.editorial-section, .case-card-link, .about-section, .contact-section').forEach(el => {
        revealObserver.observe(el);
    });

    /**
     * 3. INFINITE FILM STRIP CLONING
     * Ensures the film strip doesn't show a gap
     */
    const filmInner = document.querySelector('.film-strip-inner');
    if (filmInner) {
        // Clone contents for seamless loop
        const clone = filmInner.innerHTML;
        filmInner.innerHTML += clone;
    }

    /**
     * 4. NAVBAR SCROLL STATE
     */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar ? navbar.classList.add('scrolled') : null;
        } else {
            navbar ? navbar.classList.remove('scrolled') : null;
        }
    });

    /**
     * 5. ROLE SWITCHER (Homepage)
     */
    const roles = document.querySelectorAll('.role-text');
    if (roles.length > 0) {
        let currentIndex = 0;
        setInterval(() => {
            roles[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % roles.length;
            roles[currentIndex].classList.add('active');
        }, 2500);
    }
});
