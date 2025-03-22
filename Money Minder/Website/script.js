// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth scroll to the target section
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function() {
            // Button pulse effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Here you would typically handle the sign-up or login flow
            // For now, we'll just log to console
            console.log('User clicked CTA button');
            
            // Mock action - redirect to a hypothetical app page
            // window.location.href = '/app';
            alert('Thank you for your interest! This would connect to the FinanceAI app in production.');
        });
    });
    
    // Add scroll effect for sections
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
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Add highlight effect to the feature cards on hover
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Remove highlight from all cards
            featureCards.forEach(c => c.classList.remove('highlight'));
            // Add highlight to current card
            this.classList.add('highlight');
        });
    });
    
    // Add responsive menu toggle for mobile (if needed)
    // This would be expanded with actual mobile menu functionality
    function setupMobileMenu() {
        // Code for mobile menu would go here
        // This is a placeholder for future implementation
    }
    
    // Check if we need to enable mobile features
    function checkResponsiveFeatures() {
        if (window.innerWidth <= 768) {
            setupMobileMenu();
        }
    }
    
    // Initial check
    checkResponsiveFeatures();
    
    // Check on resize
    window.addEventListener('resize', checkResponsiveFeatures);
});

// Add some CSS classes dynamically
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card.highlight {
            border-left: 4px solid var(--primary-color);
            background-color: rgba(47, 174, 95, 0.05);
        }
        
        @media (max-width: 768px) {
            .hero {
                flex-direction: column;
                text-align: center;
                padding: 3rem 5%;
            }
            
            .hero-content {
                margin-bottom: 2rem;
            }
            
            .nav-links {
                display: none;
            }
        }
    </style>
`);