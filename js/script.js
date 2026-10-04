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
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
            }
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
            if(selectedLang === (localStorage.getItem('lang') || 'en')) return;
            
            const translatables = document.querySelectorAll('[data-i18n]');
            translatables.forEach(el => el.classList.add('lang-exit'));
            
            langMenu.classList.remove('active');
            if (langBtn) langBtn.classList.remove('active');
            
            setTimeout(() => {
                applyLanguage(selectedLang);
                localStorage.setItem('lang', selectedLang);
                translatables.forEach(el => {
                    el.classList.remove('lang-exit');
                    el.classList.add('lang-enter');
                    setTimeout(() => el.classList.remove('lang-enter'), 400);
                });
            }, 300);
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
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
                // If element leaves via the top edge, prepare it to enter from the top
                if (entry.boundingClientRect.top < 0) {
                    entry.target.classList.add('reverse-anim');
                } else {
                    entry.target.classList.remove('reverse-anim');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .animate-on-scroll').forEach(el => observer.observe(el));

    // --- Home Page Opening Animation ---
    const typewriterEl = document.getElementById('typewriter-name');
    if (typewriterEl) {
        const textToType = typewriterEl.getAttribute('data-text');
        typewriterEl.textContent = '';
        
        // 0. Reveal Image immediately (0ms)
        const anim0 = document.querySelector('.hero-anim-0');
        if(anim0) anim0.classList.add('hero-anim-active');
        
        // 1. Reveal "HELLO, I'M" (delay 200ms)
        setTimeout(() => {
            const anim1 = document.querySelector('.hero-anim-1');
            if(anim1) anim1.classList.add('hero-anim-active');
            
            // 2. Start Typewriter Loop (delay 200ms after anim1, total 400ms)
            setTimeout(() => {
                let i = 0;
                let isDeleting = false;
                let hasRevealedOthers = false;

                function typeLoop() {
                    // Turn off glow while typing/deleting
                    typewriterEl.classList.remove('glow-active');
                    
                    let currentText = '';
                    let isDone = false;

                    if (!isDeleting && i <= textToType.length) {
                        currentText = textToType.substring(0, i);
                        i++;
                        setTimeout(typeLoop, 100);
                    } else if (isDeleting && i >= 0) {
                        currentText = textToType.substring(0, i);
                        i--;
                        setTimeout(typeLoop, 50);
                    } else {
                        // We are in the waiting period (either fully typed or fully deleted)
                        isDone = true;
                        currentText = isDeleting ? '' : textToType;
                    }

                    // Render the text safely wrapped so the cursor doesn't wrap alone
                    let words = currentText.split(' ');
                    let lastWord = words.pop() || '';
                    let firstPart = words.length > 0 ? words.join(' ') + ' ' : '';

                    typewriterEl.innerHTML = 
                        (firstPart ? '<span class="gradient-text">' + firstPart + '</span>' : '') +
                        '<span style="white-space: nowrap;">' +
                            '<span class="gradient-text">' + lastWord + '</span>' +
                            '<span class="typewriter-cursor"></span>' +
                        '</span>';

                    if (isDone) {
                        // Finished typing or deleting
                        if (!isDeleting) {
                            // Finished typing
                            typewriterEl.classList.add('glow-active');
                            const cursor = typewriterEl.querySelector('.typewriter-cursor');
                            
                            // Hide cursor briefly to let glow shine
                            setTimeout(() => {
                                if (cursor) cursor.classList.add('hide');
                            }, 800);
                            
                            if (!hasRevealedOthers) {
                                // 3. Reveal Subtitle (only first time)
                                setTimeout(() => {
                                    document.querySelectorAll('.hero-anim-2').forEach(el => el.classList.add('hero-anim-active'));
                                }, 200);
                                
                                // 4. Reveal Buttons and Image (only first time)
                                setTimeout(() => {
                                    document.querySelectorAll('.hero-anim-3').forEach(el => el.classList.add('hero-anim-active'));
                                }, 400);
                                hasRevealedOthers = true;
                            }
                            
                            // Wait 4 seconds, then start deleting
                            setTimeout(() => {
                                if (cursor) cursor.classList.remove('hide');
                                isDeleting = true;
                                i = textToType.length; // Ensure i is correct for deleting
                                typeLoop();
                            }, 4000);
                            
                        } else {
                            // Finished deleting, wait 0.5s and type again
                            isDeleting = false;
                            i = 0; // Ensure i is correct for typing
                            setTimeout(typeLoop, 500);
                        }
                    }
                }
                
                typeLoop(); // trigger first cycle
            }, 400);
        }, 200);
    }
});
