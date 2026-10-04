// --- Global Loader ---
window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Page Transitions ---
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (this.target === '_blank' || !target) return;
            
            e.preventDefault();
            const container = document.querySelector('.page-container');
            if (container) {
                container.style.animation = 'pageLeave 0.4s forwards';
                setTimeout(() => {
                    window.location.href = target;
                }, 300);
            } else {
                window.location.href = target;
            }
        });
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    // Toggle Sidebar on mobile
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if(sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') {
        currentPath = 'index.html';
    }
    
    const navLinks = document.querySelectorAll('.nav-links a:not(.lang-option), .sidebar-nav a:not(.lang-option)');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        }
    });

    // --- Language Translation Logic ---
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('current-lang');
    const currentFlag = document.getElementById('current-flag');

    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
            langBtn.classList.toggle('active');
        });
    }

    document.addEventListener('click', () => {
        if (langMenu && langMenu.classList.contains('active')) {
            langMenu.classList.remove('active');
            if (langBtn) langBtn.classList.remove('active');
        }
    });

    let savedLang = localStorage.getItem('lang') || 'en';
    applyLanguage(savedLang);

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            applyLanguage(selectedLang);
            localStorage.setItem('lang', selectedLang);
            langMenu.classList.remove('active');
            if (langBtn) langBtn.classList.remove('active');
        });
    });

    function applyLanguage(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;

        if (currentLangText && currentFlag) {
            if (lang === 'en') {
                currentLangText.textContent = 'English';
                currentFlag.src = 'assets/images/en-flag.svg';
            } else {
                currentLangText.textContent = 'Indonesia';
                currentFlag.src = 'assets/images/id-flag.svg';
            }
        }

        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
    }

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .animate-on-scroll').forEach(el => observer.observe(el));
});
