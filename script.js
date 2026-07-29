// script.js - FIXED VERSION
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const floatingActions = document.getElementById('floating-actions');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    const faqItems = document.querySelectorAll('.faq-item');
    const body = document.body;

    // Floating Actions - Ensure it's in the DOM
    if (floatingActions && !floatingActions.parentElement) {
        document.body.appendChild(floatingActions);
    }

    // Mobile Menu
    const toggleMenu = () => {
        const isActive = navLinks.classList.toggle('nav-active');
        body.style.overflow = isActive ? 'hidden' : '';
        const icon = mobileMenuBtn.querySelector('i');
        if (isActive) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        }
    };

    const closeMenu = () => {
        navLinks.classList.remove('nav-active');
        body.style.overflow = '';
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    // Close menu on nav link click
    if (navLinks) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Close menu on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992 && navLinks && navLinks.classList.contains('nav-active')) {
                closeMenu();
            }
        }, 250);
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerOffset = 120; // Top bar (40px) + Navbar (80px)
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({ 
                    top: offsetPosition, 
                    behavior: 'smooth' 
                });
                
                // Close menu if open
                if (navLinks && navLinks.classList.contains('nav-active')) {
                    closeMenu();
                }
            }
        });
    });

    // Navbar Scroll Effect (rAF-throttled, class toggle to avoid forced reflow)
    let scrollTicking = false;
    const updateNavbarState = () => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        scrollTicking = false;
    };
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateNavbarState);
            scrollTicking = true;
        }
    }, { passive: true });

    // Theme Toggle
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            const body = document.body;
            if (body.hasAttribute('data-theme')) {
                body.removeAttribute('data-theme');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // Fix for floating actions positioning on mobile
    function adjustFloatingActions() {
        if (floatingActions) {
            const bottomButtons = document.querySelector('.bottom-floating-buttons');
            if (bottomButtons && window.innerWidth < 768) {
                // Adjust floating actions to not overlap with bottom buttons
                floatingActions.style.bottom = '90px';
            } else {
                floatingActions.style.bottom = '100px';
            }
        }
    }

    // Call on load and resize
    adjustFloatingActions();
    window.addEventListener('resize', adjustFloatingActions);
});

// Prevent horizontal scroll on mobile
document.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, false);
