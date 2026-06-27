// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = Date.now();

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        update();
    });
}

// Trigger counter animation when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== SCROLL REVEAL ANIMATIONS =====
function setupRevealAnimations() {
    const reveals = [
        '.experience-content',
        '.experience-visual',
        '.service-card',
        '.consultation-content',
        '.consultation-form-wrapper',
        '.faq-item',
        '.section-header'
    ];

    reveals.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

setupRevealAnimations();

// ===== SERVICE GALLERY MODAL =====
const galleryModal = document.getElementById('galleryModal');
const galleryClose = document.getElementById('galleryClose');
const galleryTitle = document.getElementById('galleryTitle');
const gallerySubtitle = document.getElementById('gallerySubtitle');
const galleryGrid = document.getElementById('galleryGrid');

const serviceNames = {
    masterbedroom: 'Master Bedroom',
    kitchen: 'Kitchen',
    customized: 'Customized Design',
    tvunit: 'TV Unit',
    pujaunit: 'Puja Unit',
    cruise: 'Cruise Designs'
};

const serviceDescriptions = {
    masterbedroom: 'Luxurious master bedroom designs crafted for ultimate comfort and elegance',
    kitchen: 'Modern modular kitchens blending functionality with stunning aesthetics',
    customized: 'Bespoke interior solutions tailored uniquely to your vision',
    tvunit: 'Sleek and modern TV entertainment units that become focal points',
    pujaunit: 'Sacred puja spaces designed with devotion, tradition, and grace',
    cruise: 'Compact luxury interiors designed for premium cruise experiences'
};

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const service = card.getAttribute('data-service');
        galleryTitle.textContent = serviceNames[service] || 'Gallery';
        gallerySubtitle.textContent = serviceDescriptions[service] || 'Our latest projects';

        // Show placeholder (will be replaced with actual images later)
        galleryGrid.innerHTML = `
            <div class="gallery-placeholder">
                <div class="gallery-placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                </div>
                <p>Portfolio images coming soon!</p>
                <span>Contact us to see our full ${serviceNames[service]} collection</span>
                <a href="#consultation" class="btn btn-primary btn-sm gallery-cta" onclick="closeGallery()">Request Portfolio</a>
            </div>
        `;

        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
}

galleryClose.addEventListener('click', closeGallery);
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeGallery();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGallery();
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isActive) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== CONSULTATION FORM =====
const consultationForm = document.getElementById('consultationForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form details
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const service = document.getElementById('userService').value;
    const message = document.getElementById('userMessage').value.trim();

    if (!name || !email || !phone) {
        return;
    }

    // Format the WhatsApp message
    const whatsappNumber = "916290902501";
    let waText = `*New Consultation Request*%0A%0A`;
    waText += `*Name:* ${name}%0A`;
    waText += `*Phone:* ${phone}%0A`;
    waText += `*Email:* ${email}%0A`;
    
    if (service) {
        const serviceSelect = document.getElementById('userService');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        waText += `*Interested In:* ${serviceText}%0A`;
    }
    
    if (message) {
        waText += `*Message:* ${message}`;
    }

    // Animate button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span>Redirecting to WhatsApp...</span>
        <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
        </svg>
    `;

    // Redirect to WhatsApp and show success message
    setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${waText}`, '_blank');
        consultationForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
    }, 1000);
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg img');
    if (hero && window.scrollY < window.innerHeight) {
        hero.style.transform = `scale(${1.05 + window.scrollY * 0.0001}) translateY(${window.scrollY * 0.3}px)`;
    }
});

console.log('✨ Luova Creation — Website loaded successfully');
