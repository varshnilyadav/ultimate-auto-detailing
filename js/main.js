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

    // 5. Custom Cursor (if on desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        const cursorRing = document.createElement('div');
        cursorRing.classList.add('cursor-ring');
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            if(typeof gsap !== 'undefined') {
                gsap.set(cursorDot, { x: mouseX, y: mouseY, xPercent: -50, yPercent: -50 });
            } else {
                cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            }
        });

        if(typeof gsap !== 'undefined') {
            gsap.ticker.add(() => {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                gsap.set(cursorRing, { x: ringX, y: ringY, xPercent: -50, yPercent: -50 });
            });
        } else {
            // Fallback if GSAP is not loaded (though it should be)
            window.addEventListener('mousemove', (e) => {
                setTimeout(() => {
                    cursorRing.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                }, 50);
            });
        }

        // Add hover effect for interactive elements
        const interactives = document.querySelectorAll('a, button, .btn, .service-card, input, textarea, select, .brand-img-logo, .gallery-item, .info-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovered');
                cursorRing.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
            });
        });
    }
});

// GSAP Scroll Animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const revealSelectors = [
        '.gs-reveal',
        '.section-title',
        '.why-card',
        '.service-card',
        '.pricing-card',
        '.gallery-item',
        '.testi-card',
        '.team-card',
        '.info-card',
        '.contact-form',
        '.footer-grid > div',
        '.ba-container',
        '.parallax-content',
        '.stats-grid > div'
    ];
    
    // Select all elements matching the selectors, avoiding duplicates
    const reveals = document.querySelectorAll(revealSelectors.join(', '));
    
    reveals.forEach((elem) => {
        // Skip elements that are inside the hero section so they don't fade-in awkwardly on load
        if(elem.closest('.hero')) return;

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
