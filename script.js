// CUSTOM CURSOR
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let outlineX = 0,
    outlineY = 0,
    targetX = 0,
    targetY = 0;
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    const animateOutline = () => {
        outlineX += (targetX - outlineX) * 0.18;
        outlineY += (targetY - outlineY) * 0.18;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    };
    animateOutline();
    document.querySelectorAll('a, button, .faq-item, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
    });
}

// SCROLL PROGRESS BAR
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
});

// NAVBAR ACTIVE STATE (scroll-spy)
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const spySections = Array.from(navAnchorLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
const setActiveLink = () => {
    let currentId = null;
    const scrollPos = window.scrollY + 120;
    spySections.forEach(section => {
        if (section.offsetTop <= scrollPos) currentId = section.id;
    });
    navAnchorLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
};
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER (animasi + tutup dengan klik di mana aja) =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function openMenu() {
    navLinks.classList.remove('closing');
    navLinks.classList.add('open');
    hamburger.classList.add('open');
}

function closeMenu() {
    if (!navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    navLinks.classList.add('closing');
    navLinks.addEventListener('animationend', function handler() {
        navLinks.classList.remove('closing');
        navLinks.removeEventListener('animationend', handler);
    }, {
        once: true
    });
}

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// klik di mana aja di dalam menu (link ataupun bukan) langsung nutup
navLinks.addEventListener('click', closeMenu);

// klik di luar hamburger & menu juga nutup
document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    if (!clickedInsideMenu && !clickedHamburger) {
        closeMenu();
    }
});

// tutup otomatis kalau layar di-resize balik ke ukuran desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMenu();
});

// FAQ ACCORDION
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        item.classList.toggle('open');
    });
});

// SCROLL REVEAL
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// COUNT-UP HERO STATS
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const statEls = document.querySelectorAll('.hero-stats .num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        const targetVal = parseFloat(match[1]);
        const suffix = match[2];
        const isDecimal = match[1].includes('.');
        if (prefersReducedMotion) {
            statObserver.unobserve(el);
            return;
        }
        let start = null;
        const duration = 1000;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * targetVal;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) +
                suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = raw;
        };
        requestAnimationFrame(step);
        statObserver.unobserve(el);
    });
}, {
    threshold: 0.5
});
statEls.forEach(el => statObserver.observe(el));

// WHATSAPP TOOLTIP — muncul 5 detik setelah web dibuka
const waTooltip = document.getElementById('waTooltip');
const waTooltipClose = document.getElementById('waTooltipClose');
let waTooltipTimer = null;
let waTooltipHideTimer = null;

if (waTooltip) {
    waTooltipTimer = setTimeout(() => {
        waTooltip.classList.add('show');
        // auto-hide setelah 8 detik supaya tidak mengganggu terus-terusan
        waTooltipHideTimer = setTimeout(() => {
            waTooltip.classList.remove('show');
        }, 8000);
    }, 5000);
}

if (waTooltipClose) {
    waTooltipClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        waTooltip.classList.remove('show');
        clearTimeout(waTooltipTimer);
        clearTimeout(waTooltipHideTimer);
    });
}

// ===== PORTFOLIO — TAMPILKAN LEBIH BANYAK =====
const portfolioGrid = document.getElementById('portfolioGrid');
const portfolioMoreBtn = document.getElementById('portfolioMoreBtn');

if (portfolioGrid && portfolioMoreBtn) {
    const extraItems = portfolioGrid.querySelectorAll('.portfolio-extra');
    if (extraItems.length === 0) {
        portfolioMoreBtn.style.display = 'none';
    } else {
        portfolioMoreBtn.addEventListener('click', () => {
            const isExpanded = portfolioGrid.classList.toggle('expanded');
            portfolioMoreBtn.classList.toggle('is-open', isExpanded);

            if (isExpanded) {
                portfolioMoreBtn.childNodes[0].nodeValue = 'Tampilkan Lebih Sedikit ';
                extraItems.forEach(item => revealObserver.observe(item));
            } else {
                portfolioMoreBtn.childNodes[0].nodeValue = 'Tampilkan Lebih Banyak ';
                // scroll balik ke atas section portfolio biar rapi
                document.getElementById('portfolio').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ===== TESTIMONIALS — CAROUSEL RESPONSIVE =====
// 1 kartu / slide di HP, 2 kartu / slide di tablet, 3 kartu / slide di desktop.
// Fungsinya SAMA persis di semua ukuran layar: autoplay + tombol panah + dots + swipe.
const testimonialsData = [{
        initial: 'A',
        name: 'Andi Pratama',
        role: 'Founder StartupX',
        quote: 'Hasilnya gila sih. Cepet, rapih, dan komunikasinya enak. Udah pasti bakal repeat order.'
    },
    {
        initial: 'S',
        name: 'Sari Dewi',
        role: 'Owner Dewi Studio',
        quote: 'Gue suka style-nya. Beda dari yang lain. Nggak cuma dikerjain, tapi dikasih saran yang bikin hasil makin gila.'
    },
    {
        initial: 'R',
        name: 'Rizky H.',
        role: 'CEO Kreasi Digital',
        quote: 'Udah 3x kerja sama. Konsisten bagus, harga worth it, dan selalu on time. Highly recommended!'
    },
    {
        initial: 'D',
        name: 'Dina Amalia',
        role: 'Marketing Lead Bloom Co',
        quote: 'Komunikasinya enak banget, gak pernah ngilang. Progress selalu diupdate rutin tanpa gua tanya duluan.'
    },
    {
        initial: 'F',
        name: 'Farhan Ilyas',
        role: 'Founder Ruang Kopi',
        quote: 'Desainnya keluar dari template biasa. Klien-klien gua sendiri nanyain siapa yang bikin web-nya.'
    },
    {
        initial: 'M',
        name: 'Maya Puspita',
        role: 'COO Jejak Nusantara',
        quote: 'Deadline mepet pun tetep dikejar sampe beres. Total gak nyesel pindah dari vendor lama.'
    },
    {
        initial: 'B',
        name: 'Bagus Setiawan',
        role: 'Owner Warkop Digital',
        quote: 'Harga masuk akal buat hasil sekelas ini. Worth every rupiah, bakal balik lagi buat project berikutnya.'
    },
    {
        initial: 'N',
        name: 'Nadia Rahma',
        role: 'Brand Manager Klarra',
        quote: 'Awalnya ragu karena freelancer, ternyata lebih rapi dari agency yang pernah gua pakai sebelumnya.'
    },
    {
        initial: 'T',
        name: 'Teguh Wibowo',
        role: 'Founder Loka Kreatif',
        quote: 'Revisi dilayani tanpa drama, cepet ngerti maunya gua kayak apa. Bakal rekomendasiin ke temen-temen.'
    }
];

const testiCarousel = document.getElementById('testiCarousel');
const testiTrack = document.getElementById('testiTrack');
const testiViewport = document.getElementById('testiViewport');
const testiPrevBtn = document.getElementById('testiPrev');
const testiNextBtn = document.getElementById('testiNext');
const testiDotsWrap = document.getElementById('testiDots');

if (testiTrack && testiViewport && testiCarousel) {
    const starsMarkup = Array.from({
            length: 5
        })
        .map(() => '<svg class="ic" width="16" height="16"><use href="#ic-star" /></svg>')
        .join('');

    function buildCardHTML(item, colorIndex) {
        return `
            <div class="testi-card tc-${colorIndex}">
                <div class="stars">${starsMarkup}</div>
                <blockquote>&ldquo;${item.quote}&rdquo;</blockquote>
                <div class="author">
                    <div class="avatar">${item.initial}</div>
                    <div>
                        <div class="name">${item.name}</div>
                        <div class="role">${item.role}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function getPerSlide() {
        const w = window.innerWidth;
        if (w < 901) return 1;
        if (w <= 1100) return 2;
        return 3;
    }

    let perSlide = getPerSlide();
    let currentSlide = 0;
    let totalSlides = 1;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 4500;

    function renderDots() {
        testiDotsWrap.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === currentSlide ? ' active' : '');
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Testimoni ke-' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            testiDotsWrap.appendChild(dot);
        }
    }

    function renderSlides() {
        perSlide = getPerSlide();
        const slidesHTML = [];
        for (let i = 0; i < testimonialsData.length; i += perSlide) {
            const group = testimonialsData.slice(i, i + perSlide);
            const cardsHTML = group
                .map((item, idx) => buildCardHTML(item, (i + idx) % 3))
                .join('');
            slidesHTML.push(`<div class="testi-slide cols-${perSlide}">${cardsHTML}</div>`);
        }
        testiTrack.innerHTML = slidesHTML.join('');
        totalSlides = slidesHTML.length;
        currentSlide = Math.min(currentSlide, totalSlides - 1);
        renderDots();
        updateTrack(false);
    }

    function updateTrack(animate) {
        if (animate === false) {
            testiTrack.style.transition = 'none';
        }
        testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        Array.from(testiDotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        if (animate === false) {
            // paksa reflow lalu balikin transisi normal
            void testiTrack.offsetHeight;
            testiTrack.style.transition = '';
        }
    }

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        updateTrack(true);
        restartAutoplay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        if (prefersReducedMotion) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateTrack(true);
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    testiNextBtn.addEventListener('click', nextSlide);
    testiPrevBtn.addEventListener('click', prevSlide);

    // autoplay berhenti selama cursor ada di area carousel (termasuk tombol panah & dots)
    testiCarousel.addEventListener('mouseenter', stopAutoplay);
    testiCarousel.addEventListener('mouseleave', startAutoplay);
    testiCarousel.addEventListener('focusin', stopAutoplay);
    testiCarousel.addEventListener('focusout', startAutoplay);
    testiDotsWrap.addEventListener('mouseenter', stopAutoplay);
    testiDotsWrap.addEventListener('mouseleave', startAutoplay);

    // ekstra: pastikan berhenti persis pas cursor nyentuh tombol panah
    [testiPrevBtn, testiNextBtn].forEach(btn => {
        btn.addEventListener('mouseenter', stopAutoplay);
        btn.addEventListener('pointerdown', stopAutoplay);
    });

    // swipe support (mobile / touch)
    let touchStartX = 0;
    testiViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, {
        passive: true
    });
    testiViewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? nextSlide() : prevSlide();
        } else {
            startAutoplay();
        }
    }, {
        passive: true
    });

    // render ulang saat resize melewati breakpoint jumlah kartu per slide
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newPerSlide = getPerSlide();
            if (newPerSlide !== perSlide) {
                renderSlides();
            }
        }, 200);
    });

    renderSlides();
    startAutoplay();
}

// kirim ke wa bagian hubungi
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const wa = document.getElementById('wa').value;
    const layanan = document.getElementById('layanan').value;
    const pesan = document.getElementById('pesan').value;

    const text = `
Halo, saya ingin konsultasi project.

Nama: ${nama}
Email: ${email}
WA: ${wa}
Layanan: ${layanan}

Pesan:
${pesan}
    `;

    window.open(
        `https://wa.me/6282110757763?text=${encodeURIComponent(text)}`,
        '_blank'
    );
});