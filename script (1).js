
        // ========== MOBILE HAMBURGER MENU ==========
        function toggleMobileMenu() {
            const hamburger = document.getElementById('hamburger');
            const menuItems = document.getElementById('menuItems');
            
            if (!hamburger || !menuItems) return;
            
            const isActive = hamburger.classList.toggle('active');
            menuItems.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            hamburger.setAttribute('aria-expanded', isActive);
        }

        function closeMobileMenu() {
            const hamburger = document.getElementById('hamburger');
            const menuItems = document.getElementById('menuItems');
            
            if (hamburger && menuItems) {
                hamburger.classList.remove('active');
                menuItems.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }

        // Initialize hamburger menu event listeners
        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.getElementById('hamburger');
            const menuItems = document.getElementById('menuItems');
            const menuLinks = document.querySelectorAll('.menu-items a');
            const logoContainer = document.getElementById('logoContainer');
            
            // Logo click handler - navigate to home and close menu
            if (logoContainer) {
                logoContainer.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showPage('home');
                    closeMobileMenu();
                });
                
                // Keyboard support for logo (Enter and Space keys)
                logoContainer.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        showPage('home');
                        closeMobileMenu();
                    }
                });
            }
            
            // Click handler for hamburger button
            if (hamburger) {
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleMobileMenu();
                });
                
                // Keyboard support (Enter and Space keys)
                hamburger.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleMobileMenu();
                    }
                });
            }
            
            // Close menu when clicking on a menu item
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (menuItems && hamburger && menuItems.classList.contains('active')) {
                    if (!menuItems.contains(e.target) && !hamburger.contains(e.target)) {
                        closeMobileMenu();
                    }
                }
            });
            
            // Close menu on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menuItems && menuItems.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });

        // ========== CAROUSEL AUTO-ADVANCE ==========
        let carouselAutoAdvanceInterval;

        function initCarousel() {
            const slider = document.querySelector('.slider');
            if (!slider) return;

            const slides = slider.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.slider-dot');

            if (slides.length === 0) return;

            let currentIndex = 0;

            function showSlide(index) {
                const slideWidth = slider.offsetWidth;
                slider.scrollLeft = index * slideWidth;
                
                // Update active dot
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }

            // Auto-advance every 5 seconds
            if (carouselAutoAdvanceInterval) clearInterval(carouselAutoAdvanceInterval);
            carouselAutoAdvanceInterval = setInterval(nextSlide, 5000);

            // Manual dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = index;
                    showSlide(currentIndex);
                    clearInterval(carouselAutoAdvanceInterval);
                    carouselAutoAdvanceInterval = setInterval(nextSlide, 5000);
                });
            });

            // Initial slide
            showSlide(0);
        }

        // ========== PAGE NAVIGATION ==========
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.add('active');
                window.scrollTo(0, 0);
                
                // Initialize carousel if on home page
                if (pageId === 'home') {
                    setTimeout(initCarousel, 100);
                }
            }
        }

        function scrollToSection(sectionId) {
            // Make sure we're on home page
            showPage('home');
            
            // Wait for page to load, then scroll
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }

        // ========== SCROLL ANIMATIONS ==========
        function observeElements() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all elements that need animation
            document.querySelectorAll('.value-card, .feature-box, .campaign-card, .donation-card, .info-card, .impact-box, .program-card').forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        }

        // ========== COUNTER ANIMATION ==========
        function animateCounters() {
            const observerOptions = {
                threshold: 0.5
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        const numberElement = entry.target.querySelector('.number');
                        if (numberElement) {
                            const finalValue = numberElement.textContent;
                            const numValue = parseInt(finalValue.replace(/\D/g, ''));
                            animateCounter(numberElement, numValue);
                            entry.target.dataset.animated = 'true';
                        }
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.impact-box').forEach(box => {
                observer.observe(box);
            });
        }

        function animateCounter(element, target) {
            let current = 0;
            const increment = Math.ceil(target / 60);
            const duration = 1500;
            const startTime = Date.now();

            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                current = Math.floor(target * progress);
                
                const originalText = element.parentElement.querySelector('.number').textContent;
                const suffix = originalText.replace(/[0-9]/g, '');
                
                element.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = originalText;
                }
            }

            update();
        }

        // ========== FORM HANDLING - DONATION FORM ==========
        function processDonation(event) {
            event.preventDefault();

            const form = event.target;
            const submitBtn = form.querySelector('.btn-submit');
            const buttonText = submitBtn.querySelector('.button-text');
            const spinner = submitBtn.querySelector('.loading-spinner');

            // Show loading state
            submitBtn.disabled = true;
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';

            // Simulate form processing
            setTimeout(() => {
                const formData = {
                    name: document.getElementById('donorName').value,
                    email: document.getElementById('donorEmail').value,
                    amount: document.getElementById('donationAmount').value,
                    type: document.querySelector('input[name="donationType"]:checked').value,
                    purpose: document.getElementById('donationPurpose').value
                };

                // Log form data (in real implementation, send to server)
                console.log('Donation submitted:', formData);

                // Show success message
                showSuccessMessage('Thank you for your generous donation! We will send a receipt to your email.');

                // Reset form
                form.reset();

                // Reset button state
                submitBtn.disabled = false;
                buttonText.style.display = 'inline';
                spinner.style.display = 'none';
            }, 2000);
        }

        // ========== FORM HANDLING - CONTACT FORM ==========
        function processContactForm(event) {
            event.preventDefault();

            const form = event.target;
            const submitBtn = form.querySelector('.btn-submit');
            const buttonText = submitBtn.querySelector('.button-text');
            const spinner = submitBtn.querySelector('.loading-spinner');

            // Validate form
            if (!form.checkValidity()) {
                showErrorMessage('Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';

            // Simulate form processing
            setTimeout(() => {
                const formData = {
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    phone: document.getElementById('contactPhone').value,
                    subject: document.getElementById('contactSubject').value,
                    message: document.getElementById('contactMessage').value
                };

                // Log form data (in real implementation, send to server)
                console.log('Contact form submitted:', formData);

                // Show success message
                showSuccessMessage('Thank you for reaching out! We will get back to you within 24 hours.');

                // Reset form
                form.reset();

                // Reset button state
                submitBtn.disabled = false;
                buttonText.style.display = 'inline';
                spinner.style.display = 'none';
            }, 2000);
        }

        // ========== FORM HANDLING - VOLUNTEER FORM ==========
        function processVolunteerForm(event) {
            event.preventDefault();

            const form = event.target;
            const submitBtn = form.querySelector('.btn-submit');
            const buttonText = submitBtn.querySelector('.button-text');
            const spinner = submitBtn.querySelector('.loading-spinner');

            // Validate form
            if (!form.checkValidity()) {
                showErrorMessage('Please fill in all required fields correctly.');
                return;
            }

            // Validate checkbox
            const agreeCheckbox = document.getElementById('volunteerAgree');
            if (!agreeCheckbox.checked) {
                showErrorMessage('Please confirm that you understand the volunteer requirements.');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';

            // Simulate form processing
            setTimeout(() => {
                const formData = {
                    name: document.getElementById('volunteerName').value,
                    email: document.getElementById('volunteerEmail').value,
                    phone: document.getElementById('volunteerPhone').value,
                    profession: document.getElementById('volunteerProfession').value,
                    interest: document.getElementById('volunteerInterest').value,
                    availability: document.getElementById('volunteerAvailability').value,
                    experience: document.getElementById('volunteerExperience').value,
                    message: document.getElementById('volunteerMessage').value
                };

                // Log form data (in real implementation, send to server)
                console.log('Volunteer application submitted:', formData);

                // Show success message
                showSuccessMessage('Thank you for your volunteer application! We will review your submission and contact you within 2-3 business days.');

                // Reset form
                form.reset();

                // Reset button state
                submitBtn.disabled = false;
                buttonText.style.display = 'inline';
                spinner.style.display = 'none';
            }, 2000);
        }

        // ========== SUCCESS & ERROR MESSAGES ==========
        function showSuccessMessage(message) {
            const successMsg = document.getElementById('successMessage');
            const successText = document.getElementById('successText');
            
            successText.textContent = message;
            successMsg.style.display = 'flex';

            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 4000);
        }

        function showErrorMessage(message) {
            const errorMsg = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            
            errorText.textContent = message;
            errorMsg.style.display = 'flex';

            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 4000);
        }

        // ========== LAZY LOADING IMAGES ==========
        function setupLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.style.animation = 'fadeIn 0.5s ease-out';
                            imageObserver.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        // ========== INITIALIZATION ON PAGE LOAD ==========
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize carousel
            initCarousel();

            // Initialize scroll animations
            observeElements();

            // Initialize counter animations
            animateCounters();

            // Setup lazy loading
            setupLazyLoading();

            // Set home page as active
            showPage('home');

            // Add accessibility: Mark inputs as required where needed
            const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
            requiredInputs.forEach(input => {
                if (input.previousElementSibling && input.previousElementSibling.tagName === 'LABEL') {
                    // Label already shows required via HTML
                }
            });
        });

        // ========== WINDOW RESIZE HANDLING ==========
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                initCarousel();
            }, 250);
        });

        // ========== KEYBOARD ACCESSIBILITY ==========
        document.addEventListener('keydown', function(e) {
            // Close mobile menu on Escape key
            if (e.key === 'Escape') {
                const hamburger = document.getElementById('hamburger');
                const menuItems = document.getElementById('menuItems');
                if (menuItems.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    menuItems.classList.remove('active');
                }
            }
        });

        // ========== SMOOTH SCROLL BEHAVIOR ==========
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
