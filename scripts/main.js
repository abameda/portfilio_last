/* ============================================
   MAIN JAVASCRIPT
   Core functionality and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initTypingAnimation();
    initNavigation();
    initScrollAnimations();
    initProjectCards();
    initContactForm();
    initSmoothScroll();
    initCarousels();
    initFooterYear();
});

/* =============== FOOTER YEAR =============== */
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* =============== TYPING ANIMATION =============== */
function initTypingAnimation() {
    const output = document.getElementById('typing-output');
    if (!output) return;

    const text = 'IT Manager @ Amwag Travel | Full-Stack Developer | CS & AI Student @ MNU';
    let index = 0;
    const speed = 50;

    function type() {
        if (index < text.length) {
            output.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a delay
    setTimeout(type, 1500);
}

/* =============== NAVIGATION =============== */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.querySelector('.nav');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.querySelector('span').textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100));

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.querySelector('span').textContent = '☰';
        });
    });

    // Nav background on scroll
    function updateNavBackground() {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(13, 17, 23, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 240, 255, 0.1)';
        } else {
            nav.style.background = 'rgba(13, 17, 23, 0.95)';
            nav.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', throttle(updateNavBackground, 50));
}

/* =============== SCROLL ANIMATIONS =============== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Unobserve after animation
                if (!entry.target.classList.contains('keep-observing')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.fade-in, .stagger, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Skill bars animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars(entry.target);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        skillObserver.observe(skillsContainer);
    }
}

function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-progress');

    bars.forEach((bar, index) => {
        const value = parseInt(bar.dataset.value) || 0;
        const filled = Math.round(value / 5); // 20 chars total
        const empty = 20 - filled;

        // Animate the progress
        let currentFilled = 0;
        const interval = setInterval(() => {
            if (currentFilled <= filled) {
                const filledChars = '█'.repeat(currentFilled);
                const emptyChars = '░'.repeat(20 - currentFilled);
                bar.textContent = `[${filledChars}${emptyChars}]`;
                currentFilled++;
            } else {
                clearInterval(interval);
            }
        }, 30 + index * 10);
    });
}

/* =============== PROJECT CARDS =============== */
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Add tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* =============== CONTACT FORM =============== */
function initContactForm() {
    // 1. Collect Visitor Info immediately on load
    collectVisitorInfo();

    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default redirect

        const submitBtn = form.querySelector('.form-submit');
        const originalText = '> Transmit Message [ENTER]';

        // 1. Show Loading State
        submitBtn.innerHTML = '> Transmitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);

            // 2. Send Data via AJAX
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 3. Success State
                submitBtn.innerHTML = '> Message Sent Successfully! ✓';
                submitBtn.style.borderColor = 'var(--color-green)';
                submitBtn.style.color = 'var(--color-green)';
                form.reset(); // Clear form
            } else {
                // 4. Error State
                const data = await response.json();
                console.error('Formspree Error:', data);
                submitBtn.innerHTML = '> Transmission Failed (Check Console)';
                submitBtn.style.borderColor = 'var(--color-red)';
                submitBtn.style.color = 'var(--color-red)';
            }
        } catch (error) {
            console.error('Network Error:', error);
            submitBtn.innerHTML = '> Network Error';
            submitBtn.style.borderColor = 'var(--color-red)';
            submitBtn.style.color = 'var(--color-red)';
        }

        // 5. Reset Button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.borderColor = '';
            submitBtn.style.color = '';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }, 3000);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement?.querySelector('.form-label')?.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement?.querySelector('.form-label')?.classList.remove('active');
            }
        });
    });
}

async function collectVisitorInfo() {
    try {
        // --- 1. Basic Browser/Device Info ---
        const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
        setVal('device_type', deviceType);
        setVal('browser_info', navigator.userAgent);
        setVal('os_info', navigator.platform);
        setVal('screen_res', `${window.screen.width}x${window.screen.height}`);
        setVal('timezone_info', Intl.DateTimeFormat().resolvedOptions().timeZone);
        setVal('language_info', navigator.language);
        setVal('referrer_info', document.referrer || 'Direct');
        setVal('page_url', window.location.href);
        setVal('submit_time', new Date().toISOString());

        // --- 2. Advanced IP & Location Info (via IPAPI) ---
        // Using a free API that doesn't require an API key for basic usage
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();

        if (ipData) {
            const locationString = `IP: ${ipData.ip} \nLocation: ${ipData.city}, ${ipData.region}, ${ipData.country_name} \nISP: ${ipData.org} \nCoordinates: ${ipData.latitude}, ${ipData.longitude}`;
            setVal('ip_info', locationString);
        }

    } catch (error) {
        console.warn('Could not fetch IP info:', error);
        setVal('ip_info', 'Could not fetch IP data');
    }
}

// Helper to safely set value
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

/* =============== PROJECT CAROUSELS =============== */
function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Generate dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = index;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Button event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Touch/Swipe support for mobile
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left = next
                } else {
                    prevSlide(); // Swipe right = prev
                }
            }
        }
    });
}

/* =============== SMOOTH SCROLL =============== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =============== UTILITY FUNCTIONS =============== */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* =============== KONAMI CODE EASTER EGG =============== */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            // Activate special effect
            activateKonamiEffect();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiEffect() {
    // Rainbow glitch effect
    document.body.classList.add('konami-active');

    // Show message
    const message = document.createElement('div');
    message.className = 'konami-message';
    message.innerHTML = `
    <div class="konami-text">
      🎮 KONAMI CODE ACTIVATED! 🎮
      <br>
      <span style="font-size: 0.8rem; opacity: 0.7;">You found the secret!</span>
    </div>
  `;
    document.body.appendChild(message);

    // Intensify matrix
    if (window.matrixRain) {
        window.matrixRain.setOpacity('0.2');
        window.matrixRain.start();
    }

    // Remove after animation
    setTimeout(() => {
        document.body.classList.remove('konami-active');
        message.remove();
        if (window.matrixRain) {
            window.matrixRain.setOpacity('0.05');
        }
    }, 5000);
}

// Add konami styles
const konamiStyles = document.createElement('style');
konamiStyles.textContent = `
  .konami-active {
    animation: rainbowBg 0.5s infinite;
  }
  
  @keyframes rainbowBg {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  .konami-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-cyan);
    padding: 2rem 4rem;
    border-radius: 8px;
    z-index: 10000;
    text-align: center;
    animation: konamiPop 0.5s ease;
    box-shadow: 0 0 50px rgba(0, 240, 255, 0.5);
  }
  
  .konami-text {
    font-size: 1.5rem;
    color: var(--color-cyan);
    text-shadow: 0 0 20px var(--color-cyan);
  }
  
  @keyframes konamiPop {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(konamiStyles);

// Page visibility optimizations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        if (window.matrixRain) {
            window.matrixRain.stop();
        }
    } else {
        // Resume when visible
        if (window.matrixRain) {
            window.matrixRain.start();
        }
    }
});
