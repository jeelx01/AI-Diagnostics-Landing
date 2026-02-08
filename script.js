document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Card Hover Spotlight Effect (Micro-interaction)
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 4. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                     navLinks.classList.remove('active');
                     const toggle = document.querySelector('.mobile-toggle');
                     if (toggle) toggle.innerHTML = '☰';
                }
            }
        });
    });

    // 5. Waitlist Form Functionality
    const form = document.querySelector('.waitlist-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const nameInput = form.querySelector('input[name="name"]');
            const emailInput = form.querySelector('input[name="email"]');
            const clinicInput = form.querySelector('input[name="clinic"]');
            const clinicEmailInput = form.querySelector('input[name="clinic_email"]');
            const addressInput = form.querySelector('input[name="address"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            
            const originalText = btn.innerText;
            
            // CONFIGURATION: FormSubmit.co Token (Hides your email from spammers)
            const EMAIL_ADDRESS = "c88f246709b30dd813061a3e77579690"; 

            if (EMAIL_ADDRESS === "INSERT_YOUR_EMAIL_HERE") {
                alert("Please open script.js and replace 'INSERT_YOUR_EMAIL_HERE' with your actual email address to enable this form.");
                return;
            }

            btn.innerText = 'Joining...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            fetch(`https://formsubmit.co/ajax/${EMAIL_ADDRESS}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    clinic: clinicInput.value,
                    clinic_email: clinicEmailInput.value,
                    address: addressInput.value,
                    phone: phoneInput.value,
                    _subject: "New Waitlist Request - Clivora"
                })
            })
            .then(response => response.json())
            .then(data => {
                // Revert button state immediately
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                
                // Clear all inputs
                nameInput.value = '';
                emailInput.value = '';
                clinicInput.value = '';
                clinicEmailInput.value = '';
                addressInput.value = '';
                phoneInput.value = '';
                
                // Show Success Modal
                const modal = document.getElementById('successModal');
                if (modal) {
                    modal.classList.add('active');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                btn.innerText = 'Error. Try again.';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            });
        };
    }

    // 6. Mobile Menu Logic
    // Inject hamburger icon for mobile
    if (window.innerWidth <= 768) {
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        
        // Create toggle button
        const toggle = document.createElement('div');
        toggle.className = 'mobile-toggle';
        toggle.innerHTML = '☰';
        
        // Style toggle directly to ensure visibility without extra CSS
        Object.assign(toggle.style, {
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'block',
            zIndex: '101'
        });
        
        // Insert before nav-links
        if (!document.querySelector('.mobile-toggle')) {
             navContainer.insertBefore(toggle, navLinks);
        }
        
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                toggle.innerHTML = '✕';
                // Apply active styles dynamically since we didn't add .active class in CSS
                Object.assign(navLinks.style, {
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    top: '80px',
                    left: '0',
                    width: '100%',
                    background: '#050810',
                    padding: '2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    gap: '1.5rem'
                });
            } else {
                toggle.innerHTML = '☰';
                navLinks.style = ''; // Clear inline styles
            }
        });
    }

    // 7. Global Modal Functions
    window.closeModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };
});
