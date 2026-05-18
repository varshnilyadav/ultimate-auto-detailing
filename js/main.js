// Shared JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hasSeenPreloader = sessionStorage.getItem('uad_preloader_seen');

        if (!hasSeenPreloader) {
            const tl = gsap.timeline({
                onComplete: () => {
                    preloader.style.display = 'none';
                    sessionStorage.setItem('uad_preloader_seen', 'true');
                    initScrollAnimations();
                }
            });

            tl.to('.preloader-logo', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
              .to('.preloader-logo', { scale: 1.1, duration: 0.8, ease: 'power1.inOut', yoyo: true, repeat: 1 })
              .to(preloader, { opacity: 0, duration: 0.5 });
        } else {
            preloader.style.display = 'none';
            initScrollAnimations();
        }
    } else {
        // If no preloader on page, init animations immediately
        initScrollAnimations();
    }

    // 2. Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Scroll to Top
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Stats Counter
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const updateCount = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.ceil(count) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = target + suffix;
            }
        };
        updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(countUp);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats-wrap');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// GSAP Scroll Animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const reveals = document.querySelectorAll('.gs-reveal');
    reveals.forEach((elem) => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                }
            }
        );
    });
}
