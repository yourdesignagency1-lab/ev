document.addEventListener('DOMContentLoaded', () => {
    
    // --- Ultra-Luxury Mobile Drawer Controller ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-links a, .mobile-drawer-cta');

    let previousActiveElement = null;

    function getFocusableElements() {
        if (!mobileDrawer) return [];
        return Array.from(mobileDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    }

    function handleFocusTrap(e) {
        if (!mobileDrawer || !mobileDrawer.classList.contains('is-open')) return;
        const focusables = getFocusableElements();
        if (focusables.length === 0) return;
        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    function openDrawer() {
        if (!mobileDrawer) return;
        previousActiveElement = document.activeElement;

        mobileDrawer.classList.add('is-open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.add('visible');
            mobileNavOverlay.setAttribute('aria-hidden', 'false');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.add('is-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.classList.add('drawer-open');
        document.addEventListener('keydown', handleFocusTrap);

        // Auto-focus first interactive element inside drawer for accessibility
        setTimeout(() => {
            if (mobileDrawerClose) mobileDrawerClose.focus();
        }, 100);
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('is-open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('visible');
            mobileNavOverlay.setAttribute('aria-hidden', 'true');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('is-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('drawer-open');
        document.removeEventListener('keydown', handleFocusTrap);

        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        } else if (mobileMenuBtn) {
            mobileMenuBtn.focus();
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.contains('is-open');
            isOpen ? closeDrawer() : openDrawer();
        });
    }

    if (mobileDrawerClose) {
        mobileDrawerClose.addEventListener('click', closeDrawer);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeDrawer);
    }

    // Close on nav link click & update active highlight
    mobileDrawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Scroll To Top Button ---
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // offset for fixed header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // --- Statistics Counter Animation ---
    const statsSection = document.querySelector('.who-we-are');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // Use Intersection Observer for the stats section
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animated');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // --- Interactive ROI Calculator ---
    const sessionsInput = document.getElementById('sessionsInput');
    const energyInput = document.getElementById('energyInput');
    const profitMarginInput = document.getElementById('profitMarginInput');
    
    const sessionsVal = document.getElementById('sessionsVal');
    const energyVal = document.getElementById('energyVal');
    const profitMarginVal = document.getElementById('profitMarginVal');
    
    const dailyEnergyVal = document.getElementById('dailyEnergyVal');
    const grossRevenueVal = document.getElementById('grossRevenueVal');
    const dailyProfitVal = document.getElementById('dailyProfitVal');
    const monthlyProfitVal = document.getElementById('monthlyProfitVal');

    function updateROICalculator() {
        if(!sessionsInput || !energyInput || !profitMarginInput) return;
        
        const sessions = parseInt(sessionsInput.value);
        const energy = parseInt(energyInput.value);
        const profitMargin = parseFloat(profitMarginInput.value);
        
        // Update display values
        sessionsVal.textContent = sessions;
        energyVal.textContent = energy;
        profitMarginVal.textContent = profitMargin.toFixed(1);
        
        // Calculations
        const dailyEnergy = sessions * energy;
        const grossRevenue = dailyEnergy * 25; // Assuming fixed ₹25 gross charging rate
        const dailyProfit = dailyEnergy * profitMargin;
        const monthlyProfit = dailyProfit * 30;
        
        // Format numbers with commas (Indian numbering system)
        dailyEnergyVal.textContent = dailyEnergy.toLocaleString('en-IN');
        grossRevenueVal.textContent = grossRevenue.toLocaleString('en-IN');
        dailyProfitVal.textContent = dailyProfit.toLocaleString('en-IN');
        monthlyProfitVal.textContent = monthlyProfit.toLocaleString('en-IN');
    }

    if(sessionsInput && energyInput && profitMarginInput) {
        sessionsInput.addEventListener('input', updateROICalculator);
        energyInput.addEventListener('input', updateROICalculator);
        profitMarginInput.addEventListener('input', updateROICalculator);
        updateROICalculator(); // Initial calculation
    }

    // --- Charger Slideshow Logic ---
    const slides = document.querySelectorAll('.charger-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.opacity = '1';
                slide.style.transform = 'translateX(0)';
                slide.style.zIndex = '2';
                dots[i].style.background = '#00B4D8';
                dots[i].classList.add('active');
            } else {
                slide.style.opacity = '0';
                slide.style.transform = i < index ? 'translateX(-50px)' : 'translateX(50px)';
                slide.style.zIndex = '1';
                dots[i].style.background = '#cbd5e1';
                dots[i].classList.remove('active');
            }
        });
        currentSlide = index;
    }

    if (slides.length > 0) {
        // Auto slide every 4 seconds
        setInterval(() => {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }, 4000);

        // Click on dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }

    // --- Custom Select Dropdown Component ---
    const customSelectWrapper = document.getElementById('interestSelectWrapper');
    const customSelectTrigger = document.getElementById('interestSelectTrigger');
    const customSelectLabel = document.getElementById('interestSelectLabel');
    const leadInterestInput = document.getElementById('leadInterest');
    const customOptions = document.querySelectorAll('.custom-option');

    if (customSelectWrapper && customSelectTrigger) {
        customSelectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = customSelectWrapper.classList.contains('is-open');
            customSelectWrapper.classList.toggle('is-open', !isOpen);
            customSelectTrigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });

        customOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = option.getAttribute('data-value');
                const labelText = option.querySelector('span')?.textContent || val;
                
                if (leadInterestInput) leadInterestInput.value = val;
                if (customSelectLabel) customSelectLabel.textContent = labelText;

                customOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                customSelectWrapper.classList.remove('is-open');
                customSelectTrigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('is-open');
                customSelectTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                customSelectWrapper.classList.remove('is-open');
                customSelectTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

});
