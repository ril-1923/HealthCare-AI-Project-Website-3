// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeFormValidation();
    initializeAnimations();
    initializeInteractivity();
    initializeAppointmentForm();
    initializeNewsletterForm();
    initializeContactForms();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Active navigation highlighting
    function highlightActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
    highlightActiveNav();
}

// Form validation and enhancement
function initializeFormValidation() {
    // Add validation classes and feedback
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Remove existing feedback
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    let isValid = true;
    let message = '';
    
    // Required field validation
    if (required && !value) {
        isValid = false;
        message = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }
    // Password validation
    else if (type === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            message = 'Password must be at least 8 characters long';
        }
    }
    
    // Apply validation styles
    if (isValid) {
        field.classList.add('is-valid');
        if (value) {
            addFeedback(field, 'valid-feedback', 'Looks good!');
        }
    } else {
        field.classList.add('is-invalid');
        addFeedback(field, 'invalid-feedback', message);
    }
    
    return isValid;
}

function addFeedback(field, className, message) {
    const feedback = document.createElement('div');
    feedback.className = className;
    feedback.textContent = message;
    field.parentNode.appendChild(feedback);
}

// Animation and scroll effects
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .doctor-card, .contact-card');
    animateElements.forEach(el => observer.observe(el));
}

// Interactive elements
function initializeInteractivity() {
    // Password toggle functionality
    const passwordToggle = document.getElementById('togglePassword');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordField = document.getElementById('loginPassword');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Doctor appointment buttons
    const doctorButtons = document.querySelectorAll('.doctor-card .btn');
    doctorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const doctorName = this.closest('.doctor-card').querySelector('h4').textContent;
            showNotification(`Appointment request sent for ${doctorName}`, 'success');
        });
    });
    
    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Appointment form handling
function initializeAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const formData = new FormData(this);
                const appointmentData = {
                    firstName: formData.get('firstName') || document.getElementById('firstName').value,
                    lastName: formData.get('lastName') || document.getElementById('lastName').value,
                    email: formData.get('email') || document.getElementById('email').value,
                    phone: formData.get('phone') || document.getElementById('phone').value,
                    service: formData.get('service') || document.getElementById('service').value,
                    date: formData.get('appointmentDate') || document.getElementById('appointmentDate').value,
                    message: formData.get('message') || document.getElementById('message').value
                };
                
                // Simulate API call
                simulateAppointmentBooking(appointmentData);
            }
        });
        
        // Set minimum date to today
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function simulateAppointmentBooking(data) {
    showLoadingState('Booking your appointment...');
    
    setTimeout(() => {
        hideLoadingState();
        showNotification(`Appointment booked successfully for ${data.firstName} ${data.lastName} on ${data.date}`, 'success');
        document.getElementById('appointmentForm').reset();
    }, 2000);
}

// Newsletter form handling
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                showLoadingState('Subscribing...');
                
                setTimeout(() => {
                    hideLoadingState();
                    showNotification('Successfully subscribed to our newsletter!', 'success');
                    emailInput.value = '';
                }, 1500);
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

// Contact forms handling
function initializeContactForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoadingState('Sending message...');
                setTimeout(() => {
                    hideLoadingState();
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    this.reset();
                }, 2000);
            }
        });
    }
    
    // Feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoadingState('Submitting feedback...');
                setTimeout(() => {
                    hideLoadingState();
                    showNotification('Thank you for your feedback! Your input helps us improve.', 'success');
                    this.reset();
                }, 1500);
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoadingState('Logging in...');
                setTimeout(() => {
                    hideLoadingState();
                    showNotification('Login successful! Redirecting to patient portal...', 'success');
                }, 2000);
            }
        });
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Password confirmation validation
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (validateForm(this)) {
                showLoadingState('Creating account...');
                setTimeout(() => {
                    hideLoadingState();
                    showNotification('Account created successfully! Please check your email for verification.', 'success');
                    this.reset();
                }, 2500);
            }
        });
    }
}

// Utility functions
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add close button
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.btn-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showLoadingState(message = 'Loading...') {
    let loadingOverlay = document.querySelector('.loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay position-fixed w-100 h-100';
        loadingOverlay.style.cssText = `
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        loadingOverlay.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow-lg text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mb-0 loading-message">${message}</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
    } else {
        loadingOverlay.querySelector('.loading-message').textContent = message;
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoadingState() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .navbar-scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .loading-overlay {
        backdrop-filter: blur(2px);
    }
`;
document.head.appendChild(style);

// Emergency contact functionality
function initializeEmergencyContact() {
    const emergencyButtons = document.querySelectorAll('a[href="tel:911"]');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('This will call emergency services (911). Do you want to proceed?')) {
                e.preventDefault();
            }
        });
    });
}

// Call emergency contact initialization
initializeEmergencyContact();

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add lazy loading
        if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imgObserver.unobserve(img);
                        }
                    }
                });
            });
            
            imgObserver.observe(img);
        }
    });
}

// Initialize image optimization
optimizeImages();

// Mobile menu enhancement
function enhanceMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    }
}

// Initialize mobile menu enhancement
enhanceMobileMenu();

// Date picker enhancement
function enhanceDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        input.min = tomorrow.toISOString().split('T')[0];
        
        // Set maximum date to 3 months from now
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        input.max = maxDate.toISOString().split('T')[0];
    });
}

// Initialize date picker enhancement
enhanceDatePickers();

console.log('HealthCare Plus website initialized successfully!');