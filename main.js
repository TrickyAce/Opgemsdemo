// Hamburger menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Carousel functionality
        let currentSlides = {
            rings: 0,
            wristwear: 0,
            sets: 0
        };

        let autoSlideIntervals = {};
        let userHasInteracted = {
            rings: false,
            wristwear: false,
            sets: false
        };

        function currentSlide(n, category) {
            userHasInteracted[category] = true;
            clearInterval(autoSlideIntervals[category]);
            showSlide(currentSlides[category] = n - 1, category);
        }

        function changeSlide(direction, category) {
            userHasInteracted[category] = true;
            clearInterval(autoSlideIntervals[category]);
            currentSlides[category] += direction;
            showSlide(currentSlides[category], category);
        }

        function showSlide(n, category) {
            const carousel = document.getElementById(category + '-carousel');
            const dots = carousel.parentElement.querySelectorAll('.dot');
            const totalSlides = 3;
            
            if (n >= totalSlides) currentSlides[category] = 0;
            if (n < 0) currentSlides[category] = totalSlides - 1;
            
            const translateX = -currentSlides[category] * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlides[category]].classList.add('active');
        }

        // Auto-slide functionality
        function startAutoSlide(category) {
            autoSlideIntervals[category] = setInterval(() => {
                if (!userHasInteracted[category]) {
                    currentSlides[category]++;
                    showSlide(currentSlides[category], category);
                }
            }, 4000);
        }

        // Touch/Swipe functionality for mobile
        function addTouchSupport(category) {
            const carousel = document.getElementById(category + '-carousel');
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                userHasInteracted[category] = true;
                clearInterval(autoSlideIntervals[category]);
            });

            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        changeSlide(1, category);
                    } else {
                        changeSlide(-1, category);
                    }
                    isDragging = false;
                }
            });

            carousel.addEventListener('touchend', () => {
                isDragging = false;
            });

            // Mouse support for desktop
            carousel.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                isDragging = true;
                userHasInteracted[category] = true;
                clearInterval(autoSlideIntervals[category]);
            });

            carousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                currentX = e.clientX;
                const diffX = startX - currentX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        changeSlide(1, category);
                    } else {
                        changeSlide(-1, category);
                    }
                    isDragging = false;
                }
            });

            carousel.addEventListener('mouseup', () => {
                isDragging = false;
            });

            carousel.addEventListener('mouseleave', () => {
                isDragging = false;
            });
        }

        // Show all products functionality
        function showAllProducts(category) {
            document.getElementById(category + '-category').style.display = 'none';
            document.getElementById(category + '-grid').classList.add('active');
            
            // Scroll to the grid view
            document.getElementById(category + '-grid').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        function showCarousel(category) {
            document.getElementById(category + '-grid').classList.remove('active');
            document.getElementById(category + '-category').style.display = 'block';
            
            // Scroll to the carousel view
            document.getElementById(category + '-category').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all category sections
        document.querySelectorAll('.category').forEach(category => {
            observer.observe(category);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(255, 215, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize carousels
            Object.keys(currentSlides).forEach(category => {
                showSlide(0, category);
                startAutoSlide(category);
                addTouchSupport(category);
            });

            // Add loading animation to product cards
            document.querySelectorAll('.product-card, .grid-product-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            });

            // Add hover effects to buttons
            document.querySelectorAll('.whatsapp-btn, .see-more-btn, .back-btn, .cta-btn').forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });